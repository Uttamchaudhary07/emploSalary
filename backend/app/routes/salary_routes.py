from __future__ import annotations

from fastapi import APIRouter, Depends
from pydantic import BaseModel, Field

from app.api.deps import get_ml_client
from app.integrations.ml_service import MLPredictionRequest, MLServiceClient

router = APIRouter(prefix="/salary", tags=["Salary estimates"])


class SalaryEstimateRequest(BaseModel):
    job_title: str = Field(min_length=1, max_length=150)
    years_experience: float = Field(ge=0, le=60)
    country: str = Field(min_length=1, max_length=120)


class ExperienceEstimate(BaseModel):
    years: float
    salary: float


class RoleEstimate(BaseModel):
    role: str
    salary: float


class BenchmarkError(BaseModel):
    mean_absolute_error: float
    test_rows: int


class MarketPay(BaseModel):
    country: str
    role: str | None
    experience: str | None
    sample_size: int
    p25: float
    median: float
    p75: float


class SalaryEstimate(BaseModel):
    predicted_salary: float
    currency: str
    model_version: str
    experience_difference: float | None = None
    experience_estimates: list[ExperienceEstimate] = Field(default_factory=list)
    role_estimates: list[RoleEstimate] = Field(default_factory=list)
    benchmark_error: BenchmarkError | None = None
    location_difference: float | None = None
    market_pay: MarketPay | None = None


@router.post("/predict", response_model=SalaryEstimate)
async def estimate_salary(
    profile: SalaryEstimateRequest, ml_client: MLServiceClient = Depends(get_ml_client)
) -> SalaryEstimate:
    request = MLPredictionRequest(
        job_title=profile.job_title,
        years_experience=profile.years_experience,
        country=profile.country,
        city="",
        state=None,
        education_level="",
        skills=[],
        include_comparisons=True,
    )
    return SalaryEstimate.model_validate(await ml_client.predict(request))
