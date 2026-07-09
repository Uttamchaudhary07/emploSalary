from __future__ import annotations

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.skill import Skill


class SkillRepository:
    def __init__(self, session: AsyncSession) -> None:
        self._session = session

    async def search(self, query: str | None, limit: int = 20) -> list[Skill]:
        stmt = select(Skill).order_by(Skill.name)
        if query:
            stmt = stmt.where(Skill.name.ilike(f"%{query}%"))
        stmt = stmt.limit(limit)
        result = await self._session.execute(stmt)
        return list(result.scalars())

    async def get_by_names(self, names: list[str]) -> list[Skill]:
        if not names:
            return []
        stmt = select(Skill).where(Skill.name.in_(names))
        result = await self._session.execute(stmt)
        return list(result.scalars())

    async def get_or_create_many(self, names: list[str]) -> list[Skill]:
        existing = await self.get_by_names(names)
        existing_names = {skill.name for skill in existing}
        created = []
        for name in names:
            if name not in existing_names:
                skill = Skill(name=name)
                self._session.add(skill)
                created.append(skill)
                existing_names.add(name)
        if created:
            await self._session.flush()
        return existing + created
