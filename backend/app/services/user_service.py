from __future__ import annotations

from sqlalchemy.ext.asyncio import AsyncSession

from app.auth.password import hash_password, verify_password
from app.core.exceptions import InvalidCredentialsError
from app.models.user import User
from app.repositories.refresh_token_repository import RefreshTokenRepository
from app.repositories.user_repository import UserRepository
from app.schemas.user import UserUpdate


class UserService:
    def __init__(self, db: AsyncSession) -> None:
        self._db = db
        self._users = UserRepository(db)
        self._refresh_tokens = RefreshTokenRepository(db)

    async def update_profile(self, user: User, data: UserUpdate) -> User:
        fields = data.model_dump(exclude_unset=True, exclude_none=True)
        if not fields:
            return user
        updated = await self._users.update(user, **fields)
        await self._db.commit()
        return updated

    async def change_password(self, user: User, current_password: str, new_password: str) -> None:
        if not verify_password(current_password, user.hashed_password):
            raise InvalidCredentialsError("Current password is incorrect.")

        await self._users.update(user, hashed_password=hash_password(new_password))
        await self._refresh_tokens.revoke_all_for_user(user.id)
        await self._db.commit()
