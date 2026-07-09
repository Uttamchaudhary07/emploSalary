from __future__ import annotations

import pytest
from httpx import AsyncClient

PREDICTION_PAYLOAD = {
    "job_title": "Software Engineer",
    "years_experience": 5,
    "education_level": "bachelor",
    "city": "San Francisco",
    "country": "United States",
    "skills": ["Python", "FastAPI"],
}


@pytest.mark.asyncio
async def test_create_prediction_persists_and_returns_result(client: AsyncClient, auth_headers):
    response = await client.post(
        "/api/v1/predictions/predict", json=PREDICTION_PAYLOAD, headers=auth_headers
    )

    assert response.status_code == 201
    body = response.json()
    assert body["predicted_salary"] > 0
    assert body["job_role"]["title"] == "Software Engineer"
    assert body["location"]["city"] == "San Francisco"
    assert {s["name"] for s in body["skills"]} == {"Python", "FastAPI"}


@pytest.mark.asyncio
async def test_create_prediction_requires_auth(client: AsyncClient):
    response = await client.post("/api/v1/predictions/predict", json=PREDICTION_PAYLOAD)
    assert response.status_code == 401


@pytest.mark.asyncio
async def test_create_prediction_rejects_invalid_years_experience(client: AsyncClient, auth_headers):
    bad_payload = {**PREDICTION_PAYLOAD, "years_experience": -5}
    response = await client.post(
        "/api/v1/predictions/predict", json=bad_payload, headers=auth_headers
    )
    assert response.status_code == 422


@pytest.mark.asyncio
async def test_get_prediction_by_id_returns_owned_prediction(client: AsyncClient, auth_headers):
    create_response = await client.post(
        "/api/v1/predictions/predict", json=PREDICTION_PAYLOAD, headers=auth_headers
    )
    prediction_id = create_response.json()["id"]

    get_response = await client.get(f"/api/v1/predictions/{prediction_id}", headers=auth_headers)
    assert get_response.status_code == 200
    assert get_response.json()["id"] == prediction_id


@pytest.mark.asyncio
async def test_get_prediction_returns_404_for_other_users_prediction(client: AsyncClient, auth_headers):
    create_response = await client.post(
        "/api/v1/predictions/predict", json=PREDICTION_PAYLOAD, headers=auth_headers
    )
    prediction_id = create_response.json()["id"]

    other_register = await client.post(
        "/api/v1/auth/register",
        json={"email": "other@example.com", "full_name": "Other User", "password": "SecurePass123"},
    )
    other_headers = {
        "Authorization": f"Bearer {other_register.json()['tokens']['access_token']}"
    }

    response = await client.get(f"/api/v1/predictions/{prediction_id}", headers=other_headers)
    assert response.status_code == 404


@pytest.mark.asyncio
async def test_prediction_history_is_paginated_and_filterable(client: AsyncClient, auth_headers):
    await client.post("/api/v1/predictions/predict", json=PREDICTION_PAYLOAD, headers=auth_headers)
    await client.post(
        "/api/v1/predictions/predict",
        json={**PREDICTION_PAYLOAD, "job_title": "Data Scientist", "city": "Austin"},
        headers=auth_headers,
    )

    response = await client.get(
        "/api/v1/predictions/history?page=1&page_size=1", headers=auth_headers
    )
    assert response.status_code == 200
    body = response.json()
    assert body["total"] == 2
    assert len(body["items"]) == 1
    assert body["pages"] == 2

    filtered = await client.get(
        "/api/v1/predictions/history?search=Data", headers=auth_headers
    )
    assert filtered.status_code == 200
    assert filtered.json()["total"] == 1


@pytest.mark.asyncio
async def test_prediction_audit_trail_records_created_and_viewed_events(
    client: AsyncClient, auth_headers
):
    create_response = await client.post(
        "/api/v1/predictions/predict", json=PREDICTION_PAYLOAD, headers=auth_headers
    )
    prediction_id = create_response.json()["id"]

    await client.get(f"/api/v1/predictions/{prediction_id}", headers=auth_headers)

    history_response = await client.get(
        f"/api/v1/predictions/{prediction_id}/history", headers=auth_headers
    )
    assert history_response.status_code == 200
    event_types = [event["event_type"] for event in history_response.json()]
    assert "created" in event_types
    assert "viewed" in event_types
