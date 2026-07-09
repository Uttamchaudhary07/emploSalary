from __future__ import annotations

from fastapi import APIRouter, Depends

from app.api.deps import get_current_active_user, get_dashboard_service
from app.models.user import User
from app.schemas.dashboard import DashboardSummary
from app.services.dashboard_service import DashboardService

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get("/summary", response_model=DashboardSummary)
async def get_dashboard_summary(
    current_user: User = Depends(get_current_active_user),
    dashboard_service: DashboardService = Depends(get_dashboard_service),
) -> DashboardSummary:
    return await dashboard_service.get_summary(current_user)
