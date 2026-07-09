from __future__ import annotations

import uuid

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.prediction import Prediction
from app.models.saved_report import SavedReport
from app.utils.pagination import Page, PaginationParams

_PREDICTION_LOAD_OPTIONS = selectinload(SavedReport.prediction).options(
    selectinload(Prediction.job_role),
    selectinload(Prediction.location),
    selectinload(Prediction.skills),
)


class SavedReportRepository:
    def __init__(self, session: AsyncSession) -> None:
        self._session = session

    async def create(self, report: SavedReport) -> SavedReport:
        self._session.add(report)
        await self._session.flush()
        return report

    async def get_by_id(self, report_id: uuid.UUID) -> SavedReport | None:
        stmt = (
            select(SavedReport)
            .where(SavedReport.id == report_id)
            .options(_PREDICTION_LOAD_OPTIONS)
        )
        result = await self._session.execute(stmt)
        return result.scalar_one_or_none()

    async def list_for_user(self, user_id: uuid.UUID, pagination: PaginationParams) -> Page[SavedReport]:
        count_stmt = select(func.count(SavedReport.id)).where(SavedReport.user_id == user_id)
        total = (await self._session.execute(count_stmt)).scalar_one()

        stmt = (
            select(SavedReport)
            .where(SavedReport.user_id == user_id)
            .options(_PREDICTION_LOAD_OPTIONS)
            .order_by(SavedReport.created_at.desc())
            .offset(pagination.offset)
            .limit(pagination.limit)
        )
        result = await self._session.execute(stmt)
        items = list(result.scalars())
        return Page(items=items, total=total, page=pagination.page, page_size=pagination.page_size)

    async def delete(self, report: SavedReport) -> None:
        await self._session.delete(report)
        await self._session.flush()

    async def count_for_user(self, user_id: uuid.UUID) -> int:
        stmt = select(func.count(SavedReport.id)).where(SavedReport.user_id == user_id)
        return (await self._session.execute(stmt)).scalar_one()
