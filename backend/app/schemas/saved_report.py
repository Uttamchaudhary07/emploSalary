from __future__ import annotations

import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field

from app.schemas.prediction import PredictionRead


class SavedReportCreateRequest(BaseModel):
    prediction_id: uuid.UUID
    title: str = Field(min_length=1, max_length=200)
    notes: str | None = Field(default=None, max_length=2000)


class SavedReportRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    title: str
    notes: str | None
    prediction: PredictionRead
    created_at: datetime
