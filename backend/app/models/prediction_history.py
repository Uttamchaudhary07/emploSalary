from __future__ import annotations

import enum
import uuid
from typing import TYPE_CHECKING

from sqlalchemy import JSON, Enum, ForeignKey
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base, GUID, TimestampMixin, UUIDPrimaryKeyMixin

if TYPE_CHECKING:
    from app.models.prediction import Prediction

JSONVariant = JSON().with_variant(JSONB, "postgresql")


class PredictionHistoryEventType(str, enum.Enum):
    CREATED = "created"
    VIEWED = "viewed"
    EXPORTED = "exported"
    RECALCULATED = "recalculated"


class PredictionHistory(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    __tablename__ = "prediction_history"

    prediction_id: Mapped[uuid.UUID] = mapped_column(
        GUID(), ForeignKey("predictions.id", ondelete="CASCADE"), nullable=False, index=True
    )
    user_id: Mapped[uuid.UUID] = mapped_column(
        GUID(), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True
    )
    event_type: Mapped[PredictionHistoryEventType] = mapped_column(
        Enum(PredictionHistoryEventType, name="prediction_history_event_type", native_enum=False, length=20),
        nullable=False,
    )
    snapshot: Mapped[dict | None] = mapped_column(JSONVariant, nullable=True)

    prediction: Mapped["Prediction"] = relationship(back_populates="history_events")

    def __repr__(self) -> str:
        return f"<PredictionHistory id={self.id} prediction_id={self.prediction_id} event={self.event_type}>"
