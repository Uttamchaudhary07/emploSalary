from __future__ import annotations

from pydantic import BaseModel


class DependencyStatus(BaseModel):
    name: str
    healthy: bool
    detail: str | None = None


class HealthResponse(BaseModel):
    status: str
    version: str
    environment: str
    uptime_seconds: float


class ReadinessResponse(BaseModel):
    status: str
    dependencies: list[DependencyStatus]
