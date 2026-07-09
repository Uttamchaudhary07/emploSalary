from __future__ import annotations

from sqlalchemy.ext.asyncio import AsyncSession

from app.models.user import User
from app.repositories.prediction_repository import PredictionRepository
from app.schemas.analytics import PlatformOverview, SalaryTrendPoint, UserAnalytics


class AnalyticsService:
    def __init__(self, db: AsyncSession) -> None:
        self._predictions = PredictionRepository(db)

    async def get_user_analytics(self, user: User) -> UserAnalytics:
        trend_rows = await self._predictions.salary_trend_for_user(user.id)
        trend = [
            SalaryTrendPoint(
                created_at=row.created_at,
                predicted_salary=float(row.predicted_salary),
                job_title=row.job_title,
            )
            for row in trend_rows
        ]
        salaries = [point.predicted_salary for point in trend]
        return UserAnalytics(
            trend=trend,
            min_salary=min(salaries) if salaries else None,
            max_salary=max(salaries) if salaries else None,
            average_salary=(sum(salaries) / len(salaries)) if salaries else None,
        )

    async def get_platform_overview(self) -> PlatformOverview:
        stats = await self._predictions.platform_overview_stats()
        return PlatformOverview(**stats)
