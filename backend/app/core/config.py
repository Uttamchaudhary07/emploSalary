from __future__ import annotations

from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    # App
    app_name: str = "Employee Salary Estimator API"
    app_version: str = "1.0.0"
    environment: str = "development"
    api_prefix: str = "/api/v1"
    log_level: str = "INFO"
    debug: bool = False

    # CORS (comma-separated in the environment, e.g. "https://a.com,https://b.com")
    cors_origins: str = "http://localhost:3000,http://localhost:5173"

    # Database
    database_url: str = "postgresql+psycopg://user:password@localhost:5432/employee_salary"
    database_pool_size: int = 10
    database_max_overflow: int = 5
    database_echo: bool = False

    # Redis (Upstash REST API)
    upstash_redis_rest_url: str = "https://your-instance.upstash.io"
    upstash_redis_rest_token: str = "change-me"

    # JWT
    jwt_secret_key: str = "insecure-development-secret-change-me"
    jwt_algorithm: str = "HS256"
    jwt_access_token_expire_minutes: int = 30
    jwt_refresh_token_expire_days: int = 14

    # Rate limiting
    rate_limit_enabled: bool = True
    rate_limit_requests_per_minute: int = 60
    rate_limit_auth_requests_per_minute: int = 10

    # ML service integration
    ml_service_base_url: str = "http://localhost:8001"
    ml_service_predict_path: str = "/api/v1/predict"
    ml_service_health_path: str = "/health"
    ml_service_api_key: str = ""
    ml_service_timeout_seconds: float = 10.0
    ml_service_max_retries: int = 2

    # Password reset / email verification
    password_reset_token_expire_minutes: int = 30
    email_verification_token_expire_hours: int = 24

    @property
    def cors_origins_list(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]

    @property
    def is_production(self) -> bool:
        return self.environment.lower() == "production"


@lru_cache
def get_settings() -> Settings:
    return Settings()
