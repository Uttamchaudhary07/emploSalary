from __future__ import annotations

from datetime import datetime, timezone

from sqlalchemy.ext.asyncio import AsyncSession

from app.models.user import User
from app.repositories.prediction_repository import PredictionRepository
from app.repositories.saved_report_repository import SavedReportRepository
from app.schemas.dashboard import DashboardSummary
from app.schemas.prediction import PredictionSummary
from app.utils.pagination import PaginationParams


class DashboardService:
    def __init__(self, db: AsyncSession) -> None:
        self._predictions = PredictionRepository(db)
        self._reports = SavedReportRepository(db)

    async def get_summary(self, user: User) -> DashboardSummary:
        total = await self._predictions.count_for_user(user.id)
        average_salary = await self._predictions.average_salary_for_user(user.id)
        reports_count = await self._reports.count_for_user(user.id)
        latest = await self._predictions.latest_for_user(user.id)

        now = datetime.now(timezone.utc)
        month_start = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        this_month_page = await self._predictions.list_for_user(
            user.id,
            pagination=PaginationParams(page=1, page_size=1),
            date_from=month_start,
        )

        return DashboardSummary(
            total_predictions=total,
            average_predicted_salary=average_salary,
            saved_reports_count=reports_count,
            predictions_this_month=this_month_page.total,
            latest_prediction=PredictionSummary.model_validate(latest) if latest else None,
        )
