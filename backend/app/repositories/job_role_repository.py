from __future__ import annotations

import uuid

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.job_role import JobRole


class JobRoleRepository:
    def __init__(self, session: AsyncSession) -> None:
        self._session = session

    async def get_by_id(self, job_role_id: uuid.UUID) -> JobRole | None:
        return await self._session.get(JobRole, job_role_id)

    async def get_by_title(self, title: str) -> JobRole | None:
        stmt = select(JobRole).where(JobRole.title == title)
        result = await self._session.execute(stmt)
        return result.scalar_one_or_none()

    async def search(self, query: str | None, limit: int = 20) -> list[JobRole]:
        stmt = select(JobRole).order_by(JobRole.title)
        if query:
            stmt = stmt.where(JobRole.title.ilike(f"%{query}%"))
        stmt = stmt.limit(limit)
        result = await self._session.execute(stmt)
        return list(result.scalars())

    async def get_or_create(self, title: str, category: str | None = None) -> JobRole:
        existing = await self.get_by_title(title)
        if existing:
            return existing
        job_role = JobRole(title=title, category=category)
        self._session.add(job_role)
        await self._session.flush()
        return job_role
