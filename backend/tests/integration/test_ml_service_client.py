from __future__ import annotations

import httpx
import pytest

from app.core.exceptions import MLServiceError, MLServiceTimeoutError, MLServiceUnavailableError
from app.integrations.ml_service import MLPredictionRequest, MLServiceClient


def _client_with_handler(handler) -> MLServiceClient:
    transport = httpx.MockTransport(handler)
    inner = httpx.AsyncClient(transport=transport, base_url="http://mock-ml")
    return MLServiceClient(client=inner)


def _sample_request() -> MLPredictionRequest:
    return MLPredictionRequest(
        job_title="Software Engineer",
        years_experience=4,
        education_level="bachelor",
        city="Austin",
        country="United States",
        state=None,
        skills=["Python"],
    )


@pytest.mark.asyncio
async def test_predict_returns_response_on_success():
    def handler(request: httpx.Request) -> httpx.Response:
        return httpx.Response(200, json={"predicted_salary": 95000, "currency": "USD"})

    client = _client_with_handler(handler)
    result = await client.predict(_sample_request())

    assert result["predicted_salary"] == 95000
    await client.close()


@pytest.mark.asyncio
async def test_predict_raises_ml_service_error_on_400():
    def handler(request: httpx.Request) -> httpx.Response:
        return httpx.Response(400, json={"detail": "bad input"})

    client = _client_with_handler(handler)
    with pytest.raises(MLServiceError):
        await client.predict(_sample_request())
    await client.close()


@pytest.mark.asyncio
async def test_predict_retries_then_raises_unavailable_on_persistent_500():
    call_count = {"n": 0}

    def handler(request: httpx.Request) -> httpx.Response:
        call_count["n"] += 1
        return httpx.Response(500, text="server error")

    client = _client_with_handler(handler)
    expected_attempts = client._settings.ml_service_max_retries + 1

    with pytest.raises(MLServiceUnavailableError):
        await client.predict(_sample_request())

    assert call_count["n"] == expected_attempts
    await client.close()


@pytest.mark.asyncio
async def test_predict_succeeds_after_transient_500():
    call_count = {"n": 0}

    def handler(request: httpx.Request) -> httpx.Response:
        call_count["n"] += 1
        if call_count["n"] == 1:
            return httpx.Response(500, text="temporary")
        return httpx.Response(200, json={"predicted_salary": 88000, "currency": "USD"})

    client = _client_with_handler(handler)
    result = await client.predict(_sample_request())

    assert result["predicted_salary"] == 88000
    assert call_count["n"] == 2
    await client.close()


@pytest.mark.asyncio
async def test_predict_raises_timeout_error():
    def handler(request: httpx.Request) -> httpx.Response:
        raise httpx.TimeoutException("timed out", request=request)

    client = _client_with_handler(handler)

    with pytest.raises(MLServiceTimeoutError):
        await client.predict(_sample_request())
    await client.close()


@pytest.mark.asyncio
async def test_health_check_returns_true_on_200():
    def handler(request: httpx.Request) -> httpx.Response:
        return httpx.Response(200, json={"status": "ok"})

    client = _client_with_handler(handler)
    assert await client.health_check() is True
    await client.close()


@pytest.mark.asyncio
async def test_health_check_returns_false_on_connection_error():
    def handler(request: httpx.Request) -> httpx.Response:
        raise httpx.ConnectError("connection refused", request=request)

    client = _client_with_handler(handler)
    assert await client.health_check() is False
    await client.close()
