from __future__ import annotations

from typing import Protocol

from app.core.logging import get_logger

logger = get_logger(component="email_service")


class EmailSender(Protocol):
    """Outbound email interface.

    Only a logging-based implementation is provided here — wiring this up to
    a real provider (SES, Postmark, Resend, ...) is an infrastructure concern
    that belongs outside this service boundary. Every call site in this
    codebase talks to this interface, so swapping providers is a one-file change.
    """

    async def send_password_reset(self, *, to_email: str, reset_token: str) -> None: ...

    async def send_email_verification(self, *, to_email: str, verification_token: str) -> None: ...


class LoggingEmailSender:
    async def send_password_reset(self, *, to_email: str, reset_token: str) -> None:
        logger.info("Password reset requested for {} — token={}", to_email, reset_token)

    async def send_email_verification(self, *, to_email: str, verification_token: str) -> None:
        logger.info("Email verification requested for {} — token={}", to_email, verification_token)


_sender_singleton: EmailSender | None = None


def get_email_sender() -> EmailSender:
    global _sender_singleton
    if _sender_singleton is None:
        _sender_singleton = LoggingEmailSender()
    return _sender_singleton
