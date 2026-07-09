from __future__ import annotations

from sqlalchemy.ext.asyncio import AsyncSession

from app.repositories.job_role_repository import JobRoleRepository
from app.repositories.location_repository import LocationRepository
from app.repositories.skill_repository import SkillRepository


class ReferenceDataService:
    def __init__(self, db: AsyncSession) -> None:
        self._job_roles = JobRoleRepository(db)
        self._locations = LocationRepository(db)
        self._skills = SkillRepository(db)

    async def search_job_roles(self, query: str | None, limit: int = 20):
        return await self._job_roles.search(query, limit)

    async def search_locations(self, query: str | None, limit: int = 20):
        return await self._locations.search(query, limit)

    async def search_skills(self, query: str | None, limit: int = 20):
        return await self._skills.search(query, limit)
