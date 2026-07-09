from __future__ import annotations

import uuid
from datetime import datetime

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.prediction import Prediction
from app.utils.pagination import Page, PaginationParams


class PredictionRepository:
    def __init__(self, session: AsyncSession) -> None:
        self._session = session

    async def create(self, prediction: Prediction) -> Prediction:
        self._session.add(prediction)
        await self._session.flush()
        return prediction

    async def get_by_id(self, prediction_id: uuid.UUID) -> Prediction | None:
        stmt = (
            select(Prediction)
            .where(Prediction.id == prediction_id)
            .options(
                selectinload(Prediction.job_role),
                selectinload(Prediction.location),
                selectinload(Prediction.skills),
            )
        )
        result = await self._session.execute(stmt)
        return result.scalar_one_or_none()

    async def list_for_user(
        self,
        user_id: uuid.UUID,
        pagination: PaginationParams,
        *,
        job_role_id: uuid.UUID | None = None,
        location_id: uuid.UUID | None = None,
        search: str | None = None,
        date_from: datetime | None = None,
        date_to: datetime | None = None,
    ) -> Page[Prediction]:
        stmt = select(Prediction).where(Prediction.user_id == user_id)
        count_stmt = select(func.count(Prediction.id)).where(Prediction.user_id == user_id)

        if job_role_id is not None:
            stmt = stmt.where(Prediction.job_role_id == job_role_id)
            count_stmt = count_stmt.where(Prediction.job_role_id == job_role_id)
        if location_id is not None:
            stmt = stmt.where(Prediction.location_id == location_id)
            count_stmt = count_stmt.where(Prediction.location_id == location_id)
        if search:
            stmt = stmt.where(Prediction.job_title.ilike(f"%{search}%"))
            count_stmt = count_stmt.where(Prediction.job_title.ilike(f"%{search}%"))
        if date_from is not None:
            stmt = stmt.where(Prediction.created_at >= date_from)
            count_stmt = count_stmt.where(Prediction.created_at >= date_from)
        if date_to is not None:
            stmt = stmt.where(Prediction.created_at <= date_to)
            count_stmt = count_stmt.where(Prediction.created_at <= date_to)

        total = (await self._session.execute(count_stmt)).scalar_one()

        stmt = (
            stmt.options(
                selectinload(Prediction.job_role),
                selectinload(Prediction.location),
                selectinload(Prediction.skills),
            )
            .order_by(Prediction.created_at.desc())
            .offset(pagination.offset)
            .limit(pagination.limit)
        )
        result = await self._session.execute(stmt)
        items = list(result.scalars())
        return Page(items=items, total=total, page=pagination.page, page_size=pagination.page_size)

    async def count_for_user(self, user_id: uuid.UUID) -> int:
        stmt = select(func.count(Prediction.id)).where(Prediction.user_id == user_id)
        return (await self._session.execute(stmt)).scalar_one()

    async def average_salary_for_user(self, user_id: uuid.UUID) -> float | None:
        stmt = select(func.avg(Prediction.predicted_salary)).where(Prediction.user_id == user_id)
        result = (await self._session.execute(stmt)).scalar_one()
        return float(result) if result is not None else None

    async def latest_for_user(self, user_id: uuid.UUID) -> Prediction | None:
        stmt = (
            select(Prediction)
            .where(Prediction.user_id == user_id)
            .order_by(Prediction.created_at.desc())
            .limit(1)
        )
        result = await self._session.execute(stmt)
        return result.scalar_one_or_none()

    async def salary_trend_for_user(
        self, user_id: uuid.UUID, *, limit: int = 50
    ) -> list[Prediction]:
        stmt = (
            select(Prediction)
            .where(Prediction.user_id == user_id)
            .order_by(Prediction.created_at.asc())
            .limit(limit)
        )
        result = await self._session.execute(stmt)
        return list(result.scalars())

    async def platform_overview_stats(self) -> dict:
        total_predictions = (await self._session.execute(select(func.count(Prediction.id)))).scalar_one()
        avg_salary = (await self._session.execute(select(func.avg(Prediction.predicted_salary)))).scalar_one()
        distinct_users = (
            await self._session.execute(select(func.count(func.distinct(Prediction.user_id))))
        ).scalar_one()
        return {
            "total_predictions": total_predictions,
            "average_predicted_salary": float(avg_salary) if avg_salary is not None else None,
            "distinct_users": distinct_users,
        }
