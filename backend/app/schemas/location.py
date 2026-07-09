from __future__ import annotations

import uuid

from pydantic import BaseModel, ConfigDict


class LocationRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    city: str
    state: str | None = None
    country: str
