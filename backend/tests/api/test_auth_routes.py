from __future__ import annotations

import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_register_creates_user_and_returns_tokens(client: AsyncClient):
    response = await client.post(
        "/api/v1/auth/register",
        json={"email": "alice@example.com", "full_name": "Alice", "password": "SecurePass123"},
    )

    assert response.status_code == 201
    body = response.json()
    assert body["user"]["email"] == "alice@example.com"
    assert body["user"]["is_email_verified"] is False
    assert body["tokens"]["access_token"]
    assert body["tokens"]["refresh_token"]


@pytest.mark.asyncio
async def test_register_rejects_duplicate_email(client: AsyncClient):
    payload = {"email": "dup@example.com", "full_name": "Dup", "password": "SecurePass123"}
    first = await client.post("/api/v1/auth/register", json=payload)
    assert first.status_code == 201

    second = await client.post("/api/v1/auth/register", json=payload)
    assert second.status_code == 409
    assert second.json()["error_code"] == "email_already_registered"


@pytest.mark.asyncio
async def test_register_rejects_weak_password(client: AsyncClient):
    response = await client.post(
        "/api/v1/auth/register",
        json={"email": "weak@example.com", "full_name": "Weak", "password": "alllowercase"},
    )
    assert response.status_code == 422


@pytest.mark.asyncio
async def test_login_succeeds_with_correct_credentials(client: AsyncClient):
    await client.post(
        "/api/v1/auth/register",
        json={"email": "login@example.com", "full_name": "Login User", "password": "SecurePass123"},
    )

    response = await client.post(
        "/api/v1/auth/login", json={"email": "login@example.com", "password": "SecurePass123"}
    )

    assert response.status_code == 200
    assert response.json()["access_token"]


@pytest.mark.asyncio
async def test_login_fails_with_wrong_password(client: AsyncClient):
    await client.post(
        "/api/v1/auth/register",
        json={"email": "login2@example.com", "full_name": "Login User", "password": "SecurePass123"},
    )

    response = await client.post(
        "/api/v1/auth/login", json={"email": "login2@example.com", "password": "WrongPassword1"}
    )

    assert response.status_code == 401
    assert response.json()["error_code"] == "invalid_credentials"


@pytest.mark.asyncio
async def test_login_fails_for_unknown_email(client: AsyncClient):
    response = await client.post(
        "/api/v1/auth/login", json={"email": "nobody@example.com", "password": "SecurePass123"}
    )
    assert response.status_code == 401


@pytest.mark.asyncio
async def test_refresh_issues_new_tokens_and_rotates_old_one(client: AsyncClient):
    register = await client.post(
        "/api/v1/auth/register",
        json={"email": "refresh@example.com", "full_name": "Refresh User", "password": "SecurePass123"},
    )
    old_refresh_token = register.json()["tokens"]["refresh_token"]

    response = await client.post("/api/v1/auth/refresh", json={"refresh_token": old_refresh_token})
    assert response.status_code == 200
    new_tokens = response.json()
    assert new_tokens["refresh_token"] != old_refresh_token

    reuse_response = await client.post(
        "/api/v1/auth/refresh", json={"refresh_token": old_refresh_token}
    )
    assert reuse_response.status_code == 401
    assert reuse_response.json()["error_code"] == "token_revoked"


@pytest.mark.asyncio
async def test_logout_revokes_refresh_token(client: AsyncClient):
    register = await client.post(
        "/api/v1/auth/register",
        json={"email": "logout@example.com", "full_name": "Logout User", "password": "SecurePass123"},
    )
    refresh_token = register.json()["tokens"]["refresh_token"]

    logout_response = await client.post("/api/v1/auth/logout", json={"refresh_token": refresh_token})
    assert logout_response.status_code == 200

    refresh_response = await client.post("/api/v1/auth/refresh", json={"refresh_token": refresh_token})
    assert refresh_response.status_code == 401


@pytest.mark.asyncio
async def test_forgot_password_does_not_leak_account_existence(client: AsyncClient):
    response = await client.post(
        "/api/v1/auth/forgot-password", json={"email": "ghost@example.com"}
    )
    assert response.status_code == 200
    assert "message" in response.json()


@pytest.mark.asyncio
async def test_protected_route_rejects_missing_token(client: AsyncClient):
    response = await client.get("/api/v1/users/me")
    assert response.status_code == 401


@pytest.mark.asyncio
async def test_protected_route_rejects_invalid_token(client: AsyncClient):
    response = await client.get(
        "/api/v1/users/me", headers={"Authorization": "Bearer not-a-real-token"}
    )
    assert response.status_code == 401
