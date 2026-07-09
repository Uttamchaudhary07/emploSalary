from __future__ import annotations

import pytest
from httpx import AsyncClient

PREDICTION_PAYLOAD = {
    "job_title": "Product Manager",
    "years_experience": 6,
    "education_level": "master",
    "city": "Remote",
    "country": "Remote",
    "skills": [],
}


@pytest.mark.asyncio
async def test_save_and_list_and_delete_report(client: AsyncClient, auth_headers):
    prediction = await client.post(
        "/api/v1/predictions/predict", json=PREDICTION_PAYLOAD, headers=auth_headers
    )
    prediction_id = prediction.json()["id"]

    create_response = await client.post(
        "/api/v1/reports",
        json={"prediction_id": prediction_id, "title": "Offer A", "notes": "initial"},
        headers=auth_headers,
    )
    assert create_response.status_code == 201
    report_id = create_response.json()["id"]

    list_response = await client.get("/api/v1/reports", headers=auth_headers)
    assert list_response.status_code == 200
    assert list_response.json()["total"] == 1

    delete_response = await client.delete(f"/api/v1/reports/{report_id}", headers=auth_headers)
    assert delete_response.status_code == 204

    get_after_delete = await client.get(f"/api/v1/reports/{report_id}", headers=auth_headers)
    assert get_after_delete.status_code == 404


@pytest.mark.asyncio
async def test_save_report_rejects_prediction_owned_by_another_user(client: AsyncClient, auth_headers):
    prediction = await client.post(
        "/api/v1/predictions/predict", json=PREDICTION_PAYLOAD, headers=auth_headers
    )
    prediction_id = prediction.json()["id"]

    other_register = await client.post(
        "/api/v1/auth/register",
        json={"email": "reportthief@example.com", "full_name": "Thief", "password": "SecurePass123"},
    )
    other_headers = {"Authorization": f"Bearer {other_register.json()['tokens']['access_token']}"}

    response = await client.post(
        "/api/v1/reports",
        json={"prediction_id": prediction_id, "title": "Stolen"},
        headers=other_headers,
    )
    assert response.status_code == 404


@pytest.mark.asyncio
async def test_dashboard_summary_reflects_predictions_and_reports(client: AsyncClient, auth_headers):
    prediction = await client.post(
        "/api/v1/predictions/predict", json=PREDICTION_PAYLOAD, headers=auth_headers
    )
    prediction_id = prediction.json()["id"]
    await client.post(
        "/api/v1/reports",
        json={"prediction_id": prediction_id, "title": "Offer A"},
        headers=auth_headers,
    )

    response = await client.get("/api/v1/dashboard/summary", headers=auth_headers)
    assert response.status_code == 200
    body = response.json()
    assert body["total_predictions"] == 1
    assert body["saved_reports_count"] == 1
    assert body["latest_prediction"]["id"] == prediction_id


@pytest.mark.asyncio
async def test_analytics_overview_requires_admin_role(client: AsyncClient, auth_headers):
    response = await client.get("/api/v1/analytics/overview", headers=auth_headers)
    assert response.status_code == 403
    assert response.json()["error_code"] == "permission_denied"


@pytest.mark.asyncio
async def test_user_analytics_returns_own_trend(client: AsyncClient, auth_headers):
    await client.post("/api/v1/predictions/predict", json=PREDICTION_PAYLOAD, headers=auth_headers)

    response = await client.get("/api/v1/analytics/me", headers=auth_headers)
    assert response.status_code == 200
    body = response.json()
    assert len(body["trend"]) == 1
    assert body["average_salary"] is not None
