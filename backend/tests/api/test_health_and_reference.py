from __future__ import annotations

import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_liveness_returns_ok(client: AsyncClient):
    response = await client.get("/api/v1/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"


@pytest.mark.asyncio
async def test_readiness_reports_all_dependencies(client: AsyncClient):
    response = await client.get("/api/v1/health/ready")
    assert response.status_code == 200
    body = response.json()
    names = {dep["name"] for dep in body["dependencies"]}
    assert names == {"database", "redis", "ml_service"}


@pytest.mark.asyncio
async def test_reference_search_endpoints_return_empty_lists_without_error(client: AsyncClient):
    for path in ("/api/v1/reference/job-roles", "/api/v1/reference/locations", "/api/v1/reference/skills"):
        response = await client.get(path)
        assert response.status_code == 200
        assert response.json() == []


@pytest.mark.asyncio
async def test_reference_skills_are_populated_after_a_prediction(client: AsyncClient, auth_headers):
    await client.post(
        "/api/v1/predictions/predict",
        json={
            "job_title": "Backend Engineer",
            "years_experience": 2,
            "education_level": "bachelor",
            "city": "Berlin",
            "country": "Germany",
            "skills": ["Go", "Docker"],
        },
        headers=auth_headers,
    )

    response = await client.get("/api/v1/reference/skills?search=Go")
    assert response.status_code == 200
    names = [s["name"] for s in response.json()]
    assert "Go" in names
