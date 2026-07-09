from __future__ import annotations

import time
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.encoders import jsonable_encoder
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.api.v1.router import api_router
from app.core.config import get_settings
from app.core.exceptions import AppError
from app.core.logging import configure_logging, get_logger
from app.core.redis import close_redis_pool, get_redis_pool
from app.integrations.ml_service import close_ml_service_client
from app.middleware.rate_limit import RateLimitMiddleware
from app.middleware.request_logging import RequestLoggingMiddleware

settings = get_settings()
configure_logging(settings.log_level)
logger = get_logger(component="app")


@asynccontextmanager
async def lifespan(app: FastAPI):
    app.state.started_at = time.monotonic()
    redis_client = get_redis_pool()
    logger.info("{} v{} starting in {} mode", settings.app_name, settings.app_version, settings.environment)
    yield
    logger.info("Shutting down: closing Redis pool and ML service client")
    await close_redis_pool()
    await close_ml_service_client()


app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    description="Backend API for the Employee Salary Estimator platform. "
    "Delegates all ML inference to an external ML service.",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(RequestLoggingMiddleware)

if settings.rate_limit_enabled:
    app.add_middleware(
        RateLimitMiddleware,
        redis_client=get_redis_pool(),
        requests_per_minute=settings.rate_limit_requests_per_minute,
        auth_requests_per_minute=settings.rate_limit_auth_requests_per_minute,
        auth_path_prefix=f"{settings.api_prefix}/auth",
    )

app.include_router(api_router, prefix=settings.api_prefix)


@app.exception_handler(AppError)
async def app_error_handler(_: Request, exc: AppError) -> JSONResponse:
    return JSONResponse(
        status_code=exc.status_code,
        content={"error_code": exc.error_code, "detail": exc.detail},
    )


@app.exception_handler(RequestValidationError)
async def validation_error_handler(_: Request, exc: RequestValidationError) -> JSONResponse:
    return JSONResponse(
        status_code=422,
        content={
            "error_code": "validation_error",
            "detail": "The request failed validation.",
            "errors": jsonable_encoder(exc.errors()),
        },
    )


@app.exception_handler(Exception)
async def unhandled_error_handler(_: Request, exc: Exception) -> JSONResponse:
    logger.exception("Unhandled error: {}", exc)
    return JSONResponse(
        status_code=500,
        content={"error_code": "internal_error", "detail": "An unexpected error occurred."},
    )


@app.get("/", tags=["Health"])
async def root() -> dict:
    return {
        "service": settings.app_name,
        "version": settings.app_version,
        "environment": settings.environment,
        "docs": "/docs",
    }
