from __future__ import annotations

from fastapi import APIRouter, Depends

from app.api.deps import get_analytics_service, get_current_active_user, require_admin
from app.models.user import User
from app.schemas.analytics import PlatformOverview, UserAnalytics
from app.services.analytics_service import AnalyticsService

router = APIRouter(prefix="/analytics", tags=["Analytics"])


@router.get("/me", response_model=UserAnalytics)
async def get_my_analytics(
    current_user: User = Depends(get_current_active_user),
    analytics_service: AnalyticsService = Depends(get_analytics_service),
) -> UserAnalytics:
    return await analytics_service.get_user_analytics(current_user)


@router.get("/overview", response_model=PlatformOverview)
async def get_platform_overview(
    _: User = Depends(require_admin),
    analytics_service: AnalyticsService = Depends(get_analytics_service),
) -> PlatformOverview:
    return await analytics_service.get_platform_overview()
