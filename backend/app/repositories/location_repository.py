from __future__ import annotations

import uuid

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.location import Location


class LocationRepository:
    def __init__(self, session: AsyncSession) -> None:
        self._session = session

    async def get_by_id(self, location_id: uuid.UUID) -> Location | None:
        return await self._session.get(Location, location_id)

    async def search(self, query: str | None, limit: int = 20) -> list[Location]:
        stmt = select(Location).order_by(Location.country, Location.city)
        if query:
            stmt = stmt.where(Location.city.ilike(f"%{query}%") | Location.country.ilike(f"%{query}%"))
        stmt = stmt.limit(limit)
        result = await self._session.execute(stmt)
        return list(result.scalars())

    async def get_or_create(self, city: str, country: str, state: str | None = None) -> Location:
        stmt = select(Location).where(
            Location.city == city, Location.country == country, Location.state == state
        )
        result = await self._session.execute(stmt)
        existing = result.scalar_one_or_none()
        if existing:
            return existing
        location = Location(city=city, state=state, country=country)
        self._session.add(location)
        await self._session.flush()
        return location
