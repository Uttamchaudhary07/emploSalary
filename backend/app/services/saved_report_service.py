from __future__ import annotations

import uuid

from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import NotFoundError
from app.models.saved_report import SavedReport
from app.models.user import User
from app.repositories.prediction_repository import PredictionRepository
from app.repositories.saved_report_repository import SavedReportRepository
from app.schemas.saved_report import SavedReportCreateRequest
from app.utils.pagination import Page, PaginationParams


class SavedReportService:
    def __init__(self, db: AsyncSession) -> None:
        self._db = db
        self._reports = SavedReportRepository(db)
        self._predictions = PredictionRepository(db)

    async def create(self, user: User, data: SavedReportCreateRequest) -> SavedReport:
        prediction = await self._predictions.get_by_id(data.prediction_id)
        if prediction is None or prediction.user_id != user.id:
            raise NotFoundError("Prediction not found.")

        report = SavedReport(
            user_id=user.id, prediction_id=prediction.id, title=data.title, notes=data.notes
        )
        await self._reports.create(report)
        await self._db.commit()
        return await self._reports.get_by_id(report.id)

    async def list_for_user(self, user: User, pagination: PaginationParams) -> Page[SavedReport]:
        return await self._reports.list_for_user(user.id, pagination)

    async def get(self, user: User, report_id: uuid.UUID) -> SavedReport:
        report = await self._reports.get_by_id(report_id)
        if report is None or report.user_id != user.id:
            raise NotFoundError("Saved report not found.")
        return report

    async def delete(self, user: User, report_id: uuid.UUID) -> None:
        report = await self.get(user, report_id)
        await self._reports.delete(report)
        await self._db.commit()
