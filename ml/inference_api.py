"""Serve the trained India and international survey estimators over HTTP."""

from __future__ import annotations

import os
from contextlib import asynccontextmanager
from pathlib import Path
from secrets import compare_digest

import pandas as pd
from fastapi import FastAPI, Header, HTTPException, Request
from pydantic import BaseModel, Field

from scripts.benchmark_survey import SURVEY_ROLES
from scripts.survey_market import (
    MARKET_PAY_FILE,
    estimate_market,
    experience_group,
    load_market_estimators,
    predict_international,
)
from utils.io_utils import read_json

DEFAULT_ARTIFACT_DIR = Path.home() / ".cache/emploSalary/stackoverflow-2024/benchmark"


class Location(BaseModel):
    country: str = Field(min_length=1, max_length=120)


class PredictionRequest(BaseModel):
    job_title: str = Field(min_length=1, max_length=150)
    years_experience: float = Field(ge=0, le=60)
    location: Location
    include_comparisons: bool = False


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


class PredictionResponse(BaseModel):
    predicted_salary: float
    currency: str
    model_version: str
    confidence_score: float | None = None
    experience_difference: float
    experience_estimates: list[ExperienceEstimate] = Field(default_factory=list)
    role_estimates: list[RoleEstimate] = Field(default_factory=list)
    benchmark_error: BenchmarkError | None = None
    location_difference: float | None = None
    market_pay: MarketPay | None = None


def create_app(artifact_dir: Path, api_key: str = "") -> FastAPI:
    @asynccontextmanager
    async def lifespan(service: FastAPI):
        service.state.estimators = load_market_estimators(artifact_dir)
        service.state.reports = {}
        for market, filename in (
            ("india", "expanded_survey_benchmark.json"),
            ("international", "international_survey_benchmark.json"),
        ):
            path = artifact_dir / filename
            if path.is_file():
                service.state.reports[market] = read_json(path)
        market_pay_path = artifact_dir / MARKET_PAY_FILE
        records = read_json(market_pay_path) if market_pay_path.is_file() else []
        service.state.market_pay = {
            (record["country"], record["role"], record["experience"]): record for record in records
        }
        yield

    service = FastAPI(title="emploSalary Survey Inference", lifespan=lifespan)

    @service.get("/health")
    def health() -> dict[str, str]:
        return {"status": "ok"}

    @service.post("/api/v1/predict", response_model=PredictionResponse)
    def predict(
        payload: PredictionRequest,
        request: Request,
        x_api_key: str = Header(default=""),
    ) -> PredictionResponse:
        if api_key and not compare_digest(api_key.encode(), x_api_key.encode()):
            raise HTTPException(status_code=401, detail="Invalid ML service API key.")
        try:
            estimators = request.app.state.estimators
            experience = min(payload.years_experience, 51)
            result = estimate_market(
                estimators, payload.location.country, payload.job_title, experience
            )
            salary = result["annual_total_compensation"]
            entry_salary = salary
            if experience:
                entry_salary = estimate_market(
                    estimators, payload.location.country, payload.job_title, 0
                )["annual_total_compensation"]
        except ValueError as exc:
            raise HTTPException(status_code=422, detail=str(exc)) from exc
        market = "india" if result["currency"] == "INR" else "international"
        experience_estimates = []
        role_estimates = []
        benchmark_error = None
        location_difference = None
        market_pay = None
        if payload.include_comparisons:
            country, role = result["country"], result["job_title"]
            cohorts = request.app.state.market_pay
            market_pay = (
                cohorts.get((country, role, experience_group(experience)))
                or cohorts.get((country, role, None))
                or cohorts.get((country, None, None))
            )
            years_to_compare = sorted({0, 1, 3, 5, 10, 15, 20, experience})
            known_estimates = {0: entry_salary, experience: salary}
            for years in years_to_compare:
                estimate = known_estimates.get(years)
                if estimate is None:
                    estimate = estimate_market(estimators, country, role, years)["annual_total_compensation"]
                experience_estimates.append(ExperienceEstimate(years=years, salary=estimate))

            roles = SURVEY_ROLES.values()
            if market == "international":
                estimator = estimators[market]
                roles_by_country = estimator["roles_by_country"]
                roles = roles_by_country[country]
                peer_countries = [
                    name for name, titles in roles_by_country.items() if name != country and role in titles
                ]
                if peer_countries:
                    peers = pd.DataFrame({
                        "Country": peer_countries,
                        "job_title": role,
                        "years_experience": experience,
                    })
                    peer_median = pd.Series(predict_international(estimator, peers)).median()
                    location_difference = round(salary - peer_median, 2)
            for other_role in roles:
                estimate = salary
                if other_role != role:
                    estimate = estimate_market(estimators, country, other_role, experience)["annual_total_compensation"]
                role_estimates.append(RoleEstimate(role=other_role, salary=estimate))

            report = request.app.state.reports.get(market)
            if report and market == "india":
                benchmark_error = BenchmarkError(
                    mean_absolute_error=report["test_mae_inr"]["selected"],
                    test_rows=report["india_test_rows"],
                )
            elif report and country in report["test_by_country"]:
                test = report["test_by_country"][country]
                benchmark_error = BenchmarkError(mean_absolute_error=test["mae_usd"], test_rows=test["test_rows"])

        return PredictionResponse(
            experience_estimates=experience_estimates,
            role_estimates=role_estimates,
            benchmark_error=benchmark_error,
            location_difference=location_difference,
            market_pay=market_pay,
            predicted_salary=salary,
            experience_difference=round(salary - entry_salary, 2),
            currency=result["currency"],
            model_version=f"survey-2024-{market}",
        )

    return service


app = create_app(
    Path(os.environ.get("SURVEY_ARTIFACT_DIR", DEFAULT_ARTIFACT_DIR)).expanduser(),
    os.environ.get("ML_SERVICE_API_KEY", ""),
)
