from __future__ import annotations

import uuid
from typing import TYPE_CHECKING

from sqlalchemy import JSON, Column, ForeignKey, Numeric, String, Table
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base, GUID, TimestampMixin, UUIDPrimaryKeyMixin

if TYPE_CHECKING:
    from app.models.job_role import JobRole
    from app.models.location import Location
    from app.models.prediction_history import PredictionHistory
    from app.models.skill import Skill
    from app.models.user import User

JSONVariant = JSON().with_variant(JSONB, "postgresql")

prediction_skills = Table(
    "prediction_skills",
    Base.metadata,
    Column("prediction_id", GUID(), ForeignKey("predictions.id", ondelete="CASCADE"), primary_key=True),
    Column("skill_id", GUID(), ForeignKey("skills.id", ondelete="CASCADE"), primary_key=True),
)


class Prediction(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    __tablename__ = "predictions"

    user_id: Mapped[uuid.UUID] = mapped_column(
        GUID(), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True
    )
    job_role_id: Mapped[uuid.UUID | None] = mapped_column(
        GUID(), ForeignKey("job_roles.id", ondelete="SET NULL"), nullable=True, index=True
    )
    location_id: Mapped[uuid.UUID | None] = mapped_column(
        GUID(), ForeignKey("locations.id", ondelete="SET NULL"), nullable=True, index=True
    )
    job_title: Mapped[str] = mapped_column(String(150), nullable=False)
    years_experience: Mapped[float] = mapped_column(Numeric(5, 2), nullable=False)
    education_level: Mapped[str] = mapped_column(String(50), nullable=False)

    predicted_salary: Mapped[float] = mapped_column(Numeric(14, 2), nullable=False)
    currency: Mapped[str] = mapped_column(String(3), default="USD", nullable=False)
    confidence_score: Mapped[float | None] = mapped_column(Numeric(5, 4), nullable=True)

    ml_model_version: Mapped[str] = mapped_column(String(50), nullable=False)
    ml_request_id: Mapped[str] = mapped_column(String(64), nullable=False, index=True)

    raw_input: Mapped[dict] = mapped_column(JSONVariant, nullable=False)
    raw_output: Mapped[dict] = mapped_column(JSONVariant, nullable=False)

    user: Mapped["User"] = relationship(back_populates="predictions")
    job_role: Mapped["JobRole | None"] = relationship()
    location: Mapped["Location | None"] = relationship()
    skills: Mapped[list["Skill"]] = relationship(secondary=prediction_skills)
    history_events: Mapped[list["PredictionHistory"]] = relationship(
        back_populates="prediction", cascade="all, delete-orphan"
    )

    def __repr__(self) -> str:
        return f"<Prediction id={self.id} user_id={self.user_id} salary={self.predicted_salary}>"
