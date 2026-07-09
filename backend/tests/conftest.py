from __future__ import annotations

import json
import os

os.environ.setdefault("ENVIRONMENT", "test")
os.environ.setdefault("RATE_LIMIT_ENABLED", "false")
os.environ.setdefault("JWT_SECRET_KEY", "test-secret-key-not-for-production-use-only-tests")
os.environ.setdefault("DATABASE_URL", "postgresql+psycopg://unused:unused@localhost/unused")

import fakeredis.aioredis
import httpx
import pytest
import pytest_asyncio
from httpx import ASGITransport, AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.pool import StaticPool

from app.api.deps import get_email_service, get_ml_client, get_redis
from app.core.dependencies import get_db
from app.database.base import Base
from app.integrations.ml_service import MLServiceClient
from app.main import app
from app.services.email_service import LoggingEmailSender

TEST_DATABASE_URL = "sqlite+aiosqlite:///:memory:"

test_engine = create_async_engine(
    TEST_DATABASE_URL, connect_args={"check_same_thread": False}, poolclass=StaticPool
)
TestSessionLocal = async_sessionmaker(bind=test_engine, class_=AsyncSession, expire_on_commit=False)


@pytest_asyncio.fixture(autouse=True)
async def _reset_database():
    async with test_engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield
    async with test_engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)


async def _override_get_db():
    async with TestSessionLocal() as session:
        yield session


@pytest.fixture
def fake_redis():
    server = fakeredis.aioredis.FakeRedis(decode_responses=True)
    yield server


def _mock_ml_handler(request: httpx.Request) -> httpx.Response:
    if request.url.path.endswith("/health"):
        return httpx.Response(200, json={"status": "ok"})

    payload = json.loads(request.content)
    years = payload.get("years_experience", 0)
    skills = payload.get("skills", [])
    salary = 60000 + years * 4200 + len(skills) * 1500
    return httpx.Response(
        200,
        json={
            "predicted_salary": salary,
            "currency": "USD",
            "confidence_score": 0.87,
            "model_version": "test-model-1.0.0",
        },
    )


@pytest.fixture
def mock_ml_client():
    transport = httpx.MockTransport(_mock_ml_handler)
    inner = httpx.AsyncClient(transport=transport, base_url="http://mock-ml-service")
    return MLServiceClient(client=inner)


@pytest_asyncio.fixture
async def client(fake_redis, mock_ml_client):
    app.dependency_overrides[get_db] = _override_get_db
    app.dependency_overrides[get_redis] = lambda: fake_redis
    app.dependency_overrides[get_ml_client] = lambda: mock_ml_client
    app.dependency_overrides[get_email_service] = lambda: LoggingEmailSender()

    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://testserver") as ac:
        yield ac

    app.dependency_overrides.clear()


@pytest_asyncio.fixture
async def db_session():
    async with TestSessionLocal() as session:
        yield session


@pytest_asyncio.fixture
async def registered_user(client: AsyncClient):
    payload = {
        "email": "test.user@example.com",
        "full_name": "Test User",
        "password": "SecurePass123",
    }
    response = await client.post("/api/v1/auth/register", json=payload)
    assert response.status_code == 201
    body = response.json()
    return {
        "user": body["user"],
        "tokens": body["tokens"],
        "password": payload["password"],
    }


@pytest_asyncio.fixture
async def auth_headers(registered_user):
    return {"Authorization": f"Bearer {registered_user['tokens']['access_token']}"}
