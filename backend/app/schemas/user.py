from __future__ import annotations

import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr, Field

from app.models.user import UserRole


class UserRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    email: EmailStr
    full_name: str
    role: UserRole
    is_active: bool
    is_email_verified: bool
    created_at: datetime


class UserUpdate(BaseModel):
    full_name: str | None = Field(default=None, min_length=1, max_length=255)


class ChangePasswordRequest(BaseModel):
    current_password: str = Field(min_length=1)
    new_password: str = Field(min_length=8, max_length=128)
