from __future__ import annotations

import logging
import sys
from typing import Any

from loguru import logger

_CONFIGURED = False


class InterceptHandler(logging.Handler):
    """Redirects stdlib `logging` records (uvicorn, sqlalchemy, ...) into loguru."""

    def emit(self, record: logging.LogRecord) -> None:
        try:
            level: str | int = logger.level(record.levelname).name
        except ValueError:
            level = record.levelno

        frame, depth = logging.currentframe(), 2
        while frame.f_back and "logging" in frame.f_code.co_filename:
            frame = frame.f_back
            depth += 1

        logger.opt(depth=depth, exception=record.exc_info).log(level, record.getMessage())


def configure_logging(log_level: str = "INFO") -> None:
    global _CONFIGURED
    if _CONFIGURED:
        return

    logger.remove()
    logger.add(
        sys.stdout,
        level=log_level.upper(),
        colorize=True,
        format=(
            "<green>{time:YYYY-MM-DD HH:mm:ss.SSS}</green> | "
            "<level>{level: <8}</level> | "
            "<cyan>{extra[request_id]}</cyan> | "
            "<cyan>{name}</cyan>:<cyan>{function}</cyan>:<cyan>{line}</cyan> - "
            "<level>{message}</level>"
        ),
        enqueue=True,
        backtrace=False,
        diagnose=False,
    )
    logger.configure(extra={"request_id": "-"})

    for name in ("uvicorn", "uvicorn.error", "uvicorn.access", "sqlalchemy.engine", "fastapi"):
        logging.getLogger(name).handlers = [InterceptHandler()]
        logging.getLogger(name).propagate = False

    logging.basicConfig(handlers=[InterceptHandler()], level=log_level.upper(), force=True)
    _CONFIGURED = True


def get_logger(**context: Any):
    return logger.bind(**context)
