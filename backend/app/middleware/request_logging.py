from __future__ import annotations

import time
import uuid

from starlette.middleware.base import BaseHTTPMiddleware, RequestResponseEndpoint
from starlette.requests import Request
from starlette.responses import Response

from app.core.logging import get_logger

logger = get_logger(component="http")


class RequestLoggingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next: RequestResponseEndpoint) -> Response:
        request_id = request.headers.get("X-Request-ID", str(uuid.uuid4()))
        request.state.request_id = request_id
        start = time.perf_counter()

        bound_logger = logger.bind(request_id=request_id)
        bound_logger.info("{} {} - started", request.method, request.url.path)

        try:
            response = await call_next(request)
        except Exception:
            duration_ms = (time.perf_counter() - start) * 1000
            bound_logger.exception(
                "{} {} - unhandled error after {:.2f}ms", request.method, request.url.path, duration_ms
            )
            raise

        duration_ms = (time.perf_counter() - start) * 1000
        bound_logger.info(
            "{} {} - {} in {:.2f}ms",
            request.method,
            request.url.path,
            response.status_code,
            duration_ms,
        )
        response.headers["X-Request-ID"] = request_id
        return response
