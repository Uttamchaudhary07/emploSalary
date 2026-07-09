from __future__ import annotations

from upstash_redis.asyncio import Redis

from app.core.config import get_settings

_redis_client: Redis | None = None


def get_redis_pool() -> Redis:
    global _redis_client
    if _redis_client is None:
        settings = get_settings()
        _redis_client = Redis(
            url=settings.upstash_redis_rest_url,
            token=settings.upstash_redis_rest_token,
        )
    return _redis_client


async def close_redis_pool() -> None:
    global _redis_client
    if _redis_client is not None:
        await _redis_client.close()
        _redis_client = None
