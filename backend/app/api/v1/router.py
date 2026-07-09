from __future__ import annotations

from fastapi import APIRouter

from app.routes.analytics_routes import router as analytics_router
from app.routes.auth_routes import router as auth_router
from app.routes.dashboard_routes import router as dashboard_router
from app.routes.health_routes import router as health_router
from app.routes.prediction_routes import router as prediction_router
from app.routes.reference_routes import router as reference_router
from app.routes.saved_report_routes import router as saved_report_router
from app.routes.user_routes import router as user_router

api_router = APIRouter()

api_router.include_router(health_router)
api_router.include_router(auth_router)
api_router.include_router(user_router)
api_router.include_router(prediction_router)
api_router.include_router(saved_report_router)
api_router.include_router(dashboard_router)
api_router.include_router(analytics_router)
api_router.include_router(reference_router)
