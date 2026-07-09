from __future__ import annotations

import uuid
from collections.abc import AsyncGenerator

from fastapi import Depends
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth.jwt import TokenType, decode_token
from app.core.exceptions import NotAuthenticatedError, PermissionDeniedError
from app.database.session import get_db
from app.models.user import User, UserRole
from app.repositories.user_repository import UserRepository

__all__ = ["get_db", "get_current_user", "get_current_active_user", "require_role"]

_bearer_scheme = HTTPBearer(auto_error=False)


async def get_current_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(_bearer_scheme),
    db: AsyncSession = Depends(get_db),
) -> User:
    if credentials is None:
        raise NotAuthenticatedError("Missing bearer token.")

    payload = decode_token(credentials.credentials, TokenType.ACCESS)
    user = await UserRepository(db).get_by_id(uuid.UUID(payload.sub))
    if user is None or not user.is_active:
        raise NotAuthenticatedError("User not found or inactive.")
    return user


async def get_current_active_user(user: User = Depends(get_current_user)) -> User:
    if not user.is_active:
        raise NotAuthenticatedError("User account is disabled.")
    return user


def require_role(*allowed_roles: UserRole):
    async def _dependency(user: User = Depends(get_current_active_user)) -> User:
        if user.role not in allowed_roles:
            raise PermissionDeniedError(
                f"Role '{user.role.value}' is not permitted to perform this action."
            )
        return user

    return _dependency
