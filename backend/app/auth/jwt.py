from __future__ import annotations

import uuid
from dataclasses import dataclass
from datetime import datetime, timedelta, timezone
from enum import Enum

import jwt

from app.core.config import get_settings
from app.core.exceptions import InvalidTokenError, TokenExpiredError

settings = get_settings()


class TokenType(str, Enum):
    ACCESS = "access"
    REFRESH = "refresh"


@dataclass(frozen=True)
class TokenPayload:
    sub: str
    role: str
    token_type: TokenType
    jti: str
    exp: datetime
    iat: datetime


def _encode(subject: str, role: str, token_type: TokenType, expires_delta: timedelta) -> tuple[str, str]:
    now = datetime.now(timezone.utc)
    jti = str(uuid.uuid4())
    payload = {
        "sub": subject,
        "role": role,
        "type": token_type.value,
        "jti": jti,
        "iat": now,
        "exp": now + expires_delta,
    }
    token = jwt.encode(payload, settings.jwt_secret_key, algorithm=settings.jwt_algorithm)
    return token, jti


def create_access_token(subject: str, role: str) -> tuple[str, str]:
    return _encode(
        subject, role, TokenType.ACCESS, timedelta(minutes=settings.jwt_access_token_expire_minutes)
    )


def create_refresh_token(subject: str, role: str) -> tuple[str, str]:
    return _encode(
        subject, role, TokenType.REFRESH, timedelta(days=settings.jwt_refresh_token_expire_days)
    )


def decode_token(token: str, expected_type: TokenType) -> TokenPayload:
    try:
        raw = jwt.decode(token, settings.jwt_secret_key, algorithms=[settings.jwt_algorithm])
    except jwt.ExpiredSignatureError as exc:
        raise TokenExpiredError("Token has expired.") from exc
    except jwt.InvalidTokenError as exc:
        raise InvalidTokenError("Token is invalid or malformed.") from exc

    if raw.get("type") != expected_type.value:
        raise InvalidTokenError(f"Expected a {expected_type.value} token.")

    return TokenPayload(
        sub=raw["sub"],
        role=raw["role"],
        token_type=TokenType(raw["type"]),
        jti=raw["jti"],
        exp=datetime.fromtimestamp(raw["exp"], tz=timezone.utc),
        iat=datetime.fromtimestamp(raw["iat"], tz=timezone.utc),
    )
