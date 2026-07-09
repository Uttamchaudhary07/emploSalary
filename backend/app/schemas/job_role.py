from __future__ import annotations

import uuid

from pydantic import BaseModel, ConfigDict


class JobRoleRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    title: str
    category: str | None = None
