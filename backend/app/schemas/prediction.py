from __future__ import annotations

import enum
import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field

from app.models.prediction_history import PredictionHistoryEventType
from app.schemas.job_role import JobRoleRead
from app.schemas.location import LocationRead
from app.schemas.skill import SkillRead


class EducationLevel(str, enum.Enum):
    HIGH_SCHOOL = "high_school"
    ASSOCIATE = "associate"
    BACHELOR = "bachelor"
    MASTER = "master"
    DOCTORATE = "doctorate"
    OTHER = "other"


class PredictionCreateRequest(BaseModel):
    job_title: str = Field(min_length=1, max_length=150)
    years_experience: float = Field(ge=0, le=60)
    education_level: EducationLevel
    city: str = Field(min_length=1, max_length=120)
    country: str = Field(min_length=1, max_length=120)
    state: str | None = Field(default=None, max_length=120)
    skills: list[str] = Field(default_factory=list, max_length=30)


class PredictionRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    job_title: str
    years_experience: float
    education_level: str
    predicted_salary: float
    currency: str
    confidence_score: float | None
    ml_model_version: str
    ml_request_id: str
    job_role: JobRoleRead | None
    location: LocationRead | None
    skills: list[SkillRead]
    created_at: datetime


class PredictionSummary(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    job_title: str
    predicted_salary: float
    currency: str
    created_at: datetime


class PredictionHistoryEventRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    event_type: PredictionHistoryEventType
    snapshot: dict | None
    created_at: datetime


class PredictionFilterParams(BaseModel):
    job_role_id: uuid.UUID | None = None
    location_id: uuid.UUID | None = None
    search: str | None = None
    date_from: datetime | None = None
    date_to: datetime | None = None
