from __future__ import annotations

from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession
from upstash_redis.asyncio import Redis

from app.core.dependencies import get_current_active_user, get_db, require_role
from app.core.redis import get_redis_pool
from app.integrations.ml_service import MLServiceClient, get_ml_service_client
from app.models.user import UserRole
from app.services.analytics_service import AnalyticsService
from app.services.auth_service import AuthService
from app.services.dashboard_service import DashboardService
from app.services.email_service import EmailSender, get_email_sender
from app.services.prediction_service import PredictionService
from app.services.reference_data_service import ReferenceDataService
from app.services.saved_report_service import SavedReportService
from app.services.user_service import UserService

__all__ = [
    "get_db",
    "get_current_active_user",
    "require_admin",
    "get_auth_service",
    "get_user_service",
    "get_prediction_service",
    "get_saved_report_service",
    "get_dashboard_service",
    "get_analytics_service",
    "get_reference_data_service",
]

require_admin = require_role(UserRole.ADMIN)


def get_redis(redis_client: Redis = Depends(get_redis_pool)) -> Redis:
    return redis_client


def get_ml_client() -> MLServiceClient:
    return get_ml_service_client()


def get_email_service() -> EmailSender:
    return get_email_sender()


def get_auth_service(
    db: AsyncSession = Depends(get_db),
    redis_client: Redis = Depends(get_redis),
    email_sender: EmailSender = Depends(get_email_service),
) -> AuthService:
    return AuthService(db, redis_client, email_sender)


def get_user_service(db: AsyncSession = Depends(get_db)) -> UserService:
    return UserService(db)


def get_prediction_service(
    db: AsyncSession = Depends(get_db),
    ml_client: MLServiceClient = Depends(get_ml_client),
) -> PredictionService:
    return PredictionService(db, ml_client)


def get_saved_report_service(db: AsyncSession = Depends(get_db)) -> SavedReportService:
    return SavedReportService(db)


def get_dashboard_service(db: AsyncSession = Depends(get_db)) -> DashboardService:
    return DashboardService(db)


def get_analytics_service(db: AsyncSession = Depends(get_db)) -> AnalyticsService:
    return AnalyticsService(db)


def get_reference_data_service(db: AsyncSession = Depends(get_db)) -> ReferenceDataService:
    return ReferenceDataService(db)
