from __future__ import annotations

import time

from fastapi import APIRouter, Depends, Request
from upstash_redis.asyncio import Redis
from upstash_redis.errors import UpstashError

from app.api.deps import get_ml_client, get_redis
from app.core.config import get_settings
from app.database.session import check_database_connection
from app.integrations.ml_service import MLServiceClient
from app.schemas.health import DependencyStatus, HealthResponse, ReadinessResponse

router = APIRouter(prefix="/health", tags=["Health"])
settings = get_settings()


@router.get("", response_model=HealthResponse)
async def liveness(request: Request) -> HealthResponse:
    started_at = getattr(request.app.state, "started_at", time.monotonic())
    return HealthResponse(
        status="ok",
        version=settings.app_version,
        environment=settings.environment,
        uptime_seconds=round(time.monotonic() - started_at, 2),
    )


@router.get("/ready", response_model=ReadinessResponse)
async def readiness(
    redis_client: Redis = Depends(get_redis),
    ml_client: MLServiceClient = Depends(get_ml_client),
) -> ReadinessResponse:
    dependencies: list[DependencyStatus] = []

    db_healthy = await check_database_connection()
    dependencies.append(
        DependencyStatus(
            name="database",
            healthy=db_healthy,
            detail=None if db_healthy else "Unable to connect to the database.",
        )
    )

    try:
        await redis_client.ping()
        dependencies.append(DependencyStatus(name="redis", healthy=True))
    except UpstashError as exc:
        dependencies.append(DependencyStatus(name="redis", healthy=False, detail=str(exc)))

    ml_healthy = await ml_client.health_check()
    dependencies.append(
        DependencyStatus(
            name="ml_service",
            healthy=ml_healthy,
            detail=None if ml_healthy else "ML service health check failed.",
        )
    )

    overall_status = "ok" if all(dep.healthy for dep in dependencies) else "degraded"
    return ReadinessResponse(status=overall_status, dependencies=dependencies)
