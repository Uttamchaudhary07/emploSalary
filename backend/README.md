# Employee Salary Estimator — Backend

Production FastAPI backend for the Employee Salary Estimator platform. This
service owns auth, users, predictions, prediction history, saved reports,
dashboards and analytics. **It never loads or runs an ML model itself** —
every prediction is delegated to an external ML service over HTTP
(`app/integrations/ml_service.py`), so the two can scale, deploy, and fail
independently.

## Stack

Python 3.12 · FastAPI · SQLAlchemy 2.0 (async) · Alembic · PostgreSQL (Neon) ·
Pydantic v2 · JWT (PyJWT) · bcrypt · Upstash Redis (REST API) · HTTPX · Loguru · Docker · Pytest

## Architecture

```
app/
  api/            versioned router + shared dependency providers (deps.py)
  auth/           password hashing, JWT issuing/verification
  core/           settings, logging, exceptions, current-user/role deps, redis client
  database/       async engine/session, declarative Base, portable UUID type
  integrations/   ml_service.py — the only place that talks to the ML service
  middleware/     Redis-backed rate limiting, request logging
  models/         SQLAlchemy ORM models
  repositories/   data-access layer, one class per aggregate
  routes/         route handlers grouped by resource
  schemas/        Pydantic v2 request/response models
  services/       business logic: validate → persist → call ML service → persist result
tests/
  unit/           pure-function tests (password hashing, JWT, pagination)
  integration/    ML service client tests against a mocked transport
  api/            full HTTP-level tests against the app via httpx.ASGITransport
alembic/          migrations (schema + reference-data seed)
```

### Request flow for a prediction

`POST /api/v1/predictions/predict` → validate input → resolve/create
`JobRole` / `Location` / `Skill` rows → call the ML service via `MLServiceClient`
→ persist the `Prediction` + a `PredictionHistory("created")` audit event →
return the formatted result. If the ML service is down, times out, or errors,
the request fails with a structured `503`/`504`/`502` — this backend never
falls back to computing a prediction itself.

## Database

Tables: `users`, `refresh_tokens`, `predictions`, `prediction_history`,
`prediction_skills` (join table), `job_roles`, `locations`, `skills`,
`saved_reports`. See `app/models/`.

Primary keys use a portable `GUID` type (`app/database/base.py`) — native
`UUID` on PostgreSQL, `CHAR(36)` elsewhere — so the same models work against
Neon in production and SQLite in tests.

## Setup

```bash
cd backend
python3.12 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp ../.env.example ../.env   # root-level, shared with frontend; fill in DATABASE_URL (Neon), JWT_SECRET_KEY, etc.
```

Run migrations (creates schema + seeds ~20 job roles, ~17 locations, ~22 skills):

```bash
alembic upgrade head
```

Run the API:

```bash
uvicorn app.main:app --reload --port 8000
```

Interactive docs at `http://localhost:8000/docs`.

## Configuration

All configuration is environment-driven (see root `.env.example` /
`app/core/config.py`). The backend reads `.env` from the repo root, shared
with the frontend. Notable groups:

- **Database**: `DATABASE_URL` — Neon connection string using the `psycopg`
  (v3) driver, e.g. `postgresql+psycopg://user:pass@host/db?sslmode=require`.
  The same driver string works for both the async runtime engine and Alembic's
  sync migration engine.
- **JWT**: `JWT_SECRET_KEY`, `JWT_ACCESS_TOKEN_EXPIRE_MINUTES` (default 30),
  `JWT_REFRESH_TOKEN_EXPIRE_DAYS` (default 14). Refresh tokens are rotated on
  every use and their hashes are stored in `refresh_tokens` so they can be
  revoked (logout, password reset, password change all revoke).
- **Redis (Upstash)**: `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` —
  from the Upstash console's REST API section for your database. Used for
  rate limiting and for short-lived password-reset / email-verification
  tokens (no extra DB tables needed for those). The client talks to Upstash's
  HTTP REST API (`upstash-redis` package), not the raw Redis wire protocol.
- **ML service**: `ML_SERVICE_BASE_URL`, `ML_SERVICE_PREDICT_PATH`,
  `ML_SERVICE_API_KEY`, `ML_SERVICE_TIMEOUT_SECONDS`, `ML_SERVICE_MAX_RETRIES`.
  The client retries transient failures (timeouts, connection errors, 5xx)
  with exponential backoff before surfacing `MLServiceTimeoutError` /
  `MLServiceUnavailableError`.
- **Rate limiting**: `RATE_LIMIT_REQUESTS_PER_MINUTE` (default 60) applies
  per-client-IP; `RATE_LIMIT_AUTH_REQUESTS_PER_MINUTE` (default 10) applies a
  stricter limit to `/api/v1/auth/*` to slow down credential stuffing.

## API surface

All routes are mounted under `API_PREFIX` (default `/api/v1`).

| Group | Routes |
|---|---|
| Auth | `POST /auth/register`, `/login`, `/refresh`, `/logout`, `/forgot-password`, `/reset-password`, `/email-verification/request`, `/email-verification/confirm` |
| User profile | `GET/PATCH /users/me`, `POST /users/me/change-password` |
| Prediction | `POST /predictions/predict`, `GET /predictions/{id}` |
| Prediction history | `GET /predictions/history` (paginated, filterable by job role/location/search/date range), `GET /predictions/{id}/history` (audit trail) |
| Saved reports | `POST/GET /reports`, `GET/DELETE /reports/{id}` |
| Dashboard | `GET /dashboard/summary` |
| Analytics | `GET /analytics/me`, `GET /analytics/overview` (admin only) |
| Reference data | `GET /reference/job-roles`, `/locations`, `/skills` (search + autocomplete) |
| Health | `GET /health` (liveness), `GET /health/ready` (checks DB, Redis, ML service) |

Every error response is `{"error_code": "...", "detail": "..."}` with a
matching HTTP status (`app/core/exceptions.py` + the handler in
`app/main.py`), so clients can branch on `error_code` rather than parsing
messages.

## Database migrations

```bash
alembic revision --autogenerate -m "describe the change"
alembic upgrade head
alembic downgrade -1
```

`alembic/versions/e2aed9b7afdf_initial_schema.py` is the schema; the
following revision seeds reference data used by the `/reference/*` endpoints
and by prediction creation (job roles/locations/skills are otherwise
get-or-created on the fly from user input, so seeding is optional but makes
autocomplete useful out of the box).

## Testing

```bash
pytest                       # full suite
pytest tests/unit             # pure logic: password hashing, JWT, pagination
pytest tests/integration      # ML service client against a mocked HTTP transport
pytest tests/api              # full HTTP flows via httpx.ASGITransport (register → predict → history → reports)
pytest --cov=app --cov-report=term-missing
```

Tests run against an in-memory SQLite database and a `fakeredis` instance —
no external Postgres/Redis/ML service required. `tests/conftest.py` overrides
`get_db`, `get_redis`, `get_ml_client`, and `get_email_service` via FastAPI's
`dependency_overrides`.

## Docker

```bash
docker compose up --build
```

Brings up the API, Postgres, and Redis. Point `ML_SERVICE_BASE_URL` at your
running ML service (defaults to `http://ml-service:8001`, matching a sibling
compose service name if you add one). The Neon connection string can replace
the bundled Postgres service by overriding `DATABASE_URL` in `docker-compose.yml`
or an `.env` file consumed by Compose.

## Security notes

- Passwords hashed with bcrypt (cost 12); refresh tokens and password-reset/
  email-verification tokens are never stored raw — only SHA-256 hashes.
- `forgot-password` always returns `200` regardless of whether the email
  exists, to avoid account enumeration.
- All user-supplied filters/search go through SQLAlchemy's parameterized
  query builder — no raw SQL string interpolation anywhere in the codebase.
- CORS origins, rate limits, and secrets are all environment-driven; nothing
  sensitive is hardcoded.
