from __future__ import annotations

import uuid
from datetime import timedelta

from redis.asyncio import Redis
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth.jwt import TokenType, create_access_token, create_refresh_token, decode_token
from app.auth.password import hash_password, verify_password
from app.core.config import get_settings
from app.core.exceptions import (
    EmailAlreadyRegisteredError,
    InvalidCredentialsError,
    InvalidTokenError,
    NotAuthenticatedError,
    TokenExpiredError,
    TokenRevokedError,
)
from app.models.user import User
from app.repositories.refresh_token_repository import RefreshTokenRepository
from app.repositories.user_repository import UserRepository
from app.schemas.auth import RegisterRequest, TokenResponse
from app.services.email_service import EmailSender
from app.utils.security_utils import generate_secure_token, hash_token

settings = get_settings()

_PASSWORD_RESET_PREFIX = "pwd_reset"
_EMAIL_VERIFY_PREFIX = "email_verify"


class AuthService:
    def __init__(self, db: AsyncSession, redis: Redis, email_sender: EmailSender) -> None:
        self._db = db
        self._redis = redis
        self._email_sender = email_sender
        self._users = UserRepository(db)
        self._refresh_tokens = RefreshTokenRepository(db)

    async def register(self, data: RegisterRequest) -> tuple[User, TokenResponse]:
        existing = await self._users.get_by_email(data.email)
        if existing is not None:
            raise EmailAlreadyRegisteredError()

        try:
            user = await self._users.create(
                email=data.email,
                hashed_password=hash_password(data.password),
                full_name=data.full_name,
            )
            tokens = await self._issue_tokens(user)
        except IntegrityError as exc:
            await self._db.rollback()
            raise EmailAlreadyRegisteredError() from exc

        await self._db.commit()
        await self.send_email_verification(user)
        return user, tokens

    async def login(self, email: str, password: str) -> tuple[User, TokenResponse]:
        user = await self._users.get_by_email(email)
        if user is None or not verify_password(password, user.hashed_password):
            raise InvalidCredentialsError()
        if not user.is_active:
            raise InvalidCredentialsError("This account has been disabled.")

        tokens = await self._issue_tokens(user)
        await self._db.commit()
        return user, tokens

    async def refresh(self, raw_refresh_token: str) -> TokenResponse:
        payload = decode_token(raw_refresh_token, TokenType.REFRESH)

        stored = await self._refresh_tokens.get_by_hash(hash_token(raw_refresh_token))
        if stored is None or not RefreshTokenRepository.is_valid(stored):
            raise TokenRevokedError("Refresh token has been revoked or has expired.")

        user = await self._users.get_by_id(uuid.UUID(payload.sub))
        if user is None or not user.is_active:
            raise NotAuthenticatedError("User not found or inactive.")

        await self._refresh_tokens.revoke(stored)
        tokens = await self._issue_tokens(user)
        await self._db.commit()
        return tokens

    async def logout(self, raw_refresh_token: str) -> None:
        try:
            decode_token(raw_refresh_token, TokenType.REFRESH)
        except (TokenExpiredError, InvalidTokenError):
            return

        stored = await self._refresh_tokens.get_by_hash(hash_token(raw_refresh_token))
        if stored is not None:
            await self._refresh_tokens.revoke(stored)
            await self._db.commit()

    async def forgot_password(self, email: str) -> None:
        user = await self._users.get_by_email(email)
        if user is None:
            # Do not reveal whether an account exists for this email.
            return

        token = generate_secure_token()
        key = f"{_PASSWORD_RESET_PREFIX}:{hash_token(token)}"
        ttl_seconds = int(timedelta(minutes=settings.password_reset_token_expire_minutes).total_seconds())
        await self._redis.set(key, str(user.id), ex=ttl_seconds)
        await self._email_sender.send_password_reset(to_email=user.email, reset_token=token)

    async def reset_password(self, token: str, new_password: str) -> None:
        key = f"{_PASSWORD_RESET_PREFIX}:{hash_token(token)}"
        user_id = await self._redis.get(key)
        if not user_id:
            raise InvalidTokenError("Password reset token is invalid or has expired.")

        user = await self._users.get_by_id(uuid.UUID(user_id))
        if user is None:
            raise InvalidTokenError("Password reset token is invalid or has expired.")

        await self._users.update(user, hashed_password=hash_password(new_password))
        await self._refresh_tokens.revoke_all_for_user(user.id)
        await self._db.commit()
        await self._redis.delete(key)

    async def send_email_verification(self, user: User) -> None:
        if user.is_email_verified:
            return

        token = generate_secure_token()
        key = f"{_EMAIL_VERIFY_PREFIX}:{hash_token(token)}"
        ttl_seconds = int(timedelta(hours=settings.email_verification_token_expire_hours).total_seconds())
        await self._redis.set(key, str(user.id), ex=ttl_seconds)
        await self._email_sender.send_email_verification(to_email=user.email, verification_token=token)

    async def verify_email(self, token: str) -> None:
        key = f"{_EMAIL_VERIFY_PREFIX}:{hash_token(token)}"
        user_id = await self._redis.get(key)
        if not user_id:
            raise InvalidTokenError("Verification token is invalid or has expired.")

        user = await self._users.get_by_id(uuid.UUID(user_id))
        if user is None:
            raise InvalidTokenError("Verification token is invalid or has expired.")

        await self._users.update(user, is_email_verified=True)
        await self._db.commit()
        await self._redis.delete(key)

    async def _issue_tokens(self, user: User) -> TokenResponse:
        access_token, _ = create_access_token(str(user.id), user.role.value)
        refresh_token, _ = create_refresh_token(str(user.id), user.role.value)
        refresh_payload = decode_token(refresh_token, TokenType.REFRESH)

        await self._refresh_tokens.create(
            user_id=user.id,
            token_hash=hash_token(refresh_token),
            expires_at=refresh_payload.exp,
        )

        return TokenResponse(
            access_token=access_token,
            refresh_token=refresh_token,
            expires_in=settings.jwt_access_token_expire_minutes * 60,
        )
