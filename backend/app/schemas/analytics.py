from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel


class SalaryTrendPoint(BaseModel):
    created_at: datetime
    predicted_salary: float
    job_title: str


class UserAnalytics(BaseModel):
    trend: list[SalaryTrendPoint]
    min_salary: float | None
    max_salary: float | None
    average_salary: float | None


class PlatformOverview(BaseModel):
    total_predictions: int
    average_predicted_salary: float | None
    distinct_users: int
