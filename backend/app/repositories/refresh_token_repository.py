from __future__ import annotations

import uuid
from datetime import datetime, timezone

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.refresh_token import RefreshToken


class RefreshTokenRepository:
    def __init__(self, session: AsyncSession) -> None:
        self._session = session

    async def create(
        self, *, user_id: uuid.UUID, token_hash: str, expires_at: datetime
    ) -> RefreshToken:
        token = RefreshToken(user_id=user_id, token_hash=token_hash, expires_at=expires_at)
        self._session.add(token)
        await self._session.flush()
        return token

    async def get_by_hash(self, token_hash: str) -> RefreshToken | None:
        stmt = select(RefreshToken).where(RefreshToken.token_hash == token_hash)
        result = await self._session.execute(stmt)
        return result.scalar_one_or_none()

    async def revoke(self, token: RefreshToken) -> None:
        token.revoked = True
        await self._session.flush()

    async def revoke_all_for_user(self, user_id: uuid.UUID) -> None:
        stmt = select(RefreshToken).where(
            RefreshToken.user_id == user_id, RefreshToken.revoked.is_(False)
        )
        result = await self._session.execute(stmt)
        for token in result.scalars():
            token.revoked = True
        await self._session.flush()

    @staticmethod
    def is_valid(token: RefreshToken) -> bool:
        expires_at = token.expires_at
        if expires_at.tzinfo is None:
            expires_at = expires_at.replace(tzinfo=timezone.utc)
        return not token.revoked and expires_at > datetime.now(timezone.utc)
