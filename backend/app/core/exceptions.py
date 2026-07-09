from __future__ import annotations


class AppError(Exception):
    """Base class for all application-raised errors."""

    status_code: int = 500
    error_code: str = "internal_error"

    def __init__(self, detail: str | None = None) -> None:
        self.detail = detail or self.__class__.__doc__ or "An unexpected error occurred."
        super().__init__(self.detail)


# --- Auth errors ---


class InvalidCredentialsError(AppError):
    """Email or password is incorrect."""

    status_code = 401
    error_code = "invalid_credentials"


class TokenExpiredError(AppError):
    """The provided token has expired."""

    status_code = 401
    error_code = "token_expired"


class InvalidTokenError(AppError):
    """The provided token is invalid or malformed."""

    status_code = 401
    error_code = "invalid_token"


class TokenRevokedError(AppError):
    """The provided refresh token has been revoked."""

    status_code = 401
    error_code = "token_revoked"


class NotAuthenticatedError(AppError):
    """Authentication is required to access this resource."""

    status_code = 401
    error_code = "not_authenticated"


class PermissionDeniedError(AppError):
    """You do not have permission to perform this action."""

    status_code = 403
    error_code = "permission_denied"


class EmailAlreadyRegisteredError(AppError):
    """An account with this email already exists."""

    status_code = 409
    error_code = "email_already_registered"


# --- Resource errors ---


class NotFoundError(AppError):
    """The requested resource was not found."""

    status_code = 404
    error_code = "not_found"


class ConflictError(AppError):
    """The request conflicts with the current state of the resource."""

    status_code = 409
    error_code = "conflict"


class ValidationAppError(AppError):
    """The request failed validation."""

    status_code = 422
    error_code = "validation_error"


# --- Rate limiting ---


class RateLimitExceededError(AppError):
    """Too many requests. Please slow down."""

    status_code = 429
    error_code = "rate_limit_exceeded"


# --- Downstream dependency errors ---


class MLServiceError(AppError):
    """The ML service returned an error."""

    status_code = 502
    error_code = "ml_service_error"


class MLServiceUnavailableError(AppError):
    """The ML service is currently unavailable."""

    status_code = 503
    error_code = "ml_service_unavailable"


class MLServiceTimeoutError(AppError):
    """The ML service did not respond in time."""

    status_code = 504
    error_code = "ml_service_timeout"


class DatabaseUnavailableError(AppError):
    """The database is currently unavailable."""

    status_code = 503
    error_code = "database_unavailable"


class CacheUnavailableError(AppError):
    """The cache/rate-limit store is currently unavailable."""

    status_code = 503
    error_code = "cache_unavailable"
