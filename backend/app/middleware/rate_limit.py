from __future__ import annotations

import time

from starlette.middleware.base import BaseHTTPMiddleware, RequestResponseEndpoint
from starlette.requests import Request
from starlette.responses import JSONResponse, Response
from upstash_redis.asyncio import Redis
from upstash_redis.errors import UpstashError

from app.core.logging import get_logger

logger = get_logger(component="rate_limit_middleware")

_WINDOW_SECONDS = 60
_EXEMPT_PATHS = {"/", "/health", "/health/ready", "/docs", "/openapi.json", "/redoc"}


class RateLimitMiddleware(BaseHTTPMiddleware):
    def __init__(
        self,
        app,
        redis_client: Redis,
        requests_per_minute: int,
        auth_requests_per_minute: int,
        auth_path_prefix: str = "/api/v1/auth",
    ) -> None:
        super().__init__(app)
        self._redis = redis_client
        self._requests_per_minute = requests_per_minute
        self._auth_requests_per_minute = auth_requests_per_minute
        self._auth_path_prefix = auth_path_prefix

    async def dispatch(self, request: Request, call_next: RequestResponseEndpoint) -> Response:
        path = request.url.path
        if path in _EXEMPT_PATHS:
            return await call_next(request)

        client_ip = request.client.host if request.client else "unknown"
        is_auth_path = path.startswith(self._auth_path_prefix)
        limit = self._auth_requests_per_minute if is_auth_path else self._requests_per_minute
        bucket = "auth" if is_auth_path else "default"
        window_id = int(time.time() // _WINDOW_SECONDS)
        key = f"rate_limit:{bucket}:{client_ip}:{window_id}"

        try:
            current_count = await self._redis.incr(key)
            if current_count == 1:
                await self._redis.expire(key, _WINDOW_SECONDS)
        except UpstashError as exc:
            logger.warning("Redis unavailable for rate limiting, failing open: {}", exc)
            return await call_next(request)

        if current_count > limit:
            return JSONResponse(
                status_code=429,
                content={
                    "error_code": "rate_limit_exceeded",
                    "detail": "Too many requests. Please slow down.",
                },
                headers={"Retry-After": str(_WINDOW_SECONDS)},
            )

        response = await call_next(request)
        response.headers["X-RateLimit-Limit"] = str(limit)
        response.headers["X-RateLimit-Remaining"] = str(max(0, limit - current_count))
        return response
