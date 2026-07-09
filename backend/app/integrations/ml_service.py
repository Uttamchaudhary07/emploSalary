from __future__ import annotations

import asyncio
import uuid
from typing import Any

import httpx

from app.core.config import get_settings
from app.core.exceptions import MLServiceError, MLServiceTimeoutError, MLServiceUnavailableError
from app.core.logging import get_logger

logger = get_logger(component="ml_service_client")


class MLPredictionRequest:
    """Wire contract sent to the external ML service's POST /predict endpoint."""

    def __init__(
        self,
        *,
        job_title: str,
        years_experience: float,
        education_level: str,
        city: str,
        country: str,
        state: str | None,
        skills: list[str],
    ) -> None:
        self.request_id = str(uuid.uuid4())
        self.job_title = job_title
        self.years_experience = years_experience
        self.education_level = education_level
        self.city = city
        self.country = country
        self.state = state
        self.skills = skills

    def to_payload(self) -> dict[str, Any]:
        return {
            "request_id": self.request_id,
            "job_title": self.job_title,
            "years_experience": self.years_experience,
            "education_level": self.education_level,
            "location": {"city": self.city, "country": self.country, "state": self.state},
            "skills": self.skills,
        }


class MLServiceClient:
    """Thin HTTPX client for the external ML inference service.

    This backend never loads a model itself; every prediction is delegated
    to the ML service over HTTP so the two can scale and deploy independently.
    """

    def __init__(self, client: httpx.AsyncClient | None = None) -> None:
        settings = get_settings()
        self._settings = settings
        self._owns_client = client is None
        self._client = client or httpx.AsyncClient(
            base_url=settings.ml_service_base_url,
            timeout=settings.ml_service_timeout_seconds,
            headers={"X-API-Key": settings.ml_service_api_key} if settings.ml_service_api_key else {},
        )

    async def close(self) -> None:
        if self._owns_client:
            await self._client.aclose()

    async def predict(self, request: MLPredictionRequest) -> dict[str, Any]:
        payload = request.to_payload()
        last_exc: Exception | None = None

        for attempt in range(self._settings.ml_service_max_retries + 1):
            try:
                response = await self._client.post(
                    self._settings.ml_service_predict_path, json=payload
                )
            except httpx.TimeoutException as exc:
                last_exc = exc
                logger.warning(
                    "ML service timeout on attempt {}/{}: {}",
                    attempt + 1,
                    self._settings.ml_service_max_retries + 1,
                    exc,
                )
                await self._backoff(attempt)
                continue
            except httpx.ConnectError as exc:
                last_exc = exc
                logger.warning(
                    "ML service unreachable on attempt {}/{}: {}",
                    attempt + 1,
                    self._settings.ml_service_max_retries + 1,
                    exc,
                )
                await self._backoff(attempt)
                continue
            except httpx.HTTPError as exc:
                logger.error("ML service transport error: {}", exc)
                raise MLServiceError(f"Failed to reach ML service: {exc}") from exc

            if response.status_code == 200:
                return response.json()

            if response.status_code >= 500:
                last_exc = MLServiceError(
                    f"ML service returned {response.status_code}: {response.text[:500]}"
                )
                logger.warning(
                    "ML service {} on attempt {}/{}",
                    response.status_code,
                    attempt + 1,
                    self._settings.ml_service_max_retries + 1,
                )
                await self._backoff(attempt)
                continue

            raise MLServiceError(
                f"ML service rejected the request ({response.status_code}): {response.text[:500]}"
            )

        if isinstance(last_exc, httpx.TimeoutException):
            raise MLServiceTimeoutError("ML service did not respond in time.") from last_exc
        raise MLServiceUnavailableError("ML service is currently unavailable.") from last_exc

    async def health_check(self) -> bool:
        try:
            response = await self._client.get(
                self._settings.ml_service_health_path, timeout=3.0
            )
            return response.status_code == 200
        except httpx.HTTPError:
            return False

    @staticmethod
    async def _backoff(attempt: int) -> None:
        await asyncio.sleep(min(0.25 * (2**attempt), 2.0))


_client_singleton: MLServiceClient | None = None


def get_ml_service_client() -> MLServiceClient:
    global _client_singleton
    if _client_singleton is None:
        _client_singleton = MLServiceClient()
    return _client_singleton


async def close_ml_service_client() -> None:
    global _client_singleton
    if _client_singleton is not None:
        await _client_singleton.close()
        _client_singleton = None
