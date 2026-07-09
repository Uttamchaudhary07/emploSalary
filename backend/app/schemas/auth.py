from __future__ import annotations

import re

from pydantic import BaseModel, EmailStr, Field, field_validator

from app.schemas.user import UserRead

_PASSWORD_UPPER_RE = re.compile(r"[A-Z]")
_PASSWORD_LOWER_RE = re.compile(r"[a-z]")
_PASSWORD_DIGIT_RE = re.compile(r"\d")


def _validate_password_strength(value: str) -> str:
    if not _PASSWORD_UPPER_RE.search(value):
        raise ValueError("Password must contain at least one uppercase letter.")
    if not _PASSWORD_LOWER_RE.search(value):
        raise ValueError("Password must contain at least one lowercase letter.")
    if not _PASSWORD_DIGIT_RE.search(value):
        raise ValueError("Password must contain at least one digit.")
    return value


class RegisterRequest(BaseModel):
    email: EmailStr
    full_name: str = Field(min_length=1, max_length=255)
    password: str = Field(min_length=8, max_length=128)

    @field_validator("password")
    @classmethod
    def validate_password(cls, value: str) -> str:
        return _validate_password_strength(value)


class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=1)


class RefreshRequest(BaseModel):
    refresh_token: str


class LogoutRequest(BaseModel):
    refresh_token: str


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int


class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str = Field(min_length=8, max_length=128)

    @field_validator("new_password")
    @classmethod
    def validate_password(cls, value: str) -> str:
        return _validate_password_strength(value)


class SendEmailVerificationRequest(BaseModel):
    email: EmailStr


class VerifyEmailRequest(BaseModel):
    token: str


class RegisterResponse(BaseModel):
    user: UserRead
    tokens: TokenResponse
