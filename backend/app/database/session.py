from __future__ import annotations

from collections.abc import AsyncGenerator

from sqlalchemy.ext.asyncio import (
    AsyncEngine,
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)

from app.core.config import get_settings

settings = get_settings()

_engine: AsyncEngine = create_async_engine(
    settings.database_url,
    echo=settings.database_echo,
    pool_size=settings.database_pool_size,
    max_overflow=settings.database_max_overflow,
    pool_pre_ping=True,
)

AsyncSessionLocal = async_sessionmaker(
    bind=_engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autoflush=False,
)


def get_engine() -> AsyncEngine:
    return _engine


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with AsyncSessionLocal() as session:
        try:
            yield session
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()


async def check_database_connection() -> bool:
    from sqlalchemy import text

    try:
        async with _engine.connect() as conn:
            await conn.execute(text("SELECT 1"))
        return True
    except Exception:
        return False
