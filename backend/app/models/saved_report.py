from __future__ import annotations

import uuid
from typing import TYPE_CHECKING

from sqlalchemy import ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base, GUID, TimestampMixin, UUIDPrimaryKeyMixin

if TYPE_CHECKING:
    from app.models.prediction import Prediction
    from app.models.user import User


class SavedReport(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    __tablename__ = "saved_reports"

    user_id: Mapped[uuid.UUID] = mapped_column(
        GUID(), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True
    )
    prediction_id: Mapped[uuid.UUID] = mapped_column(
        GUID(), ForeignKey("predictions.id", ondelete="CASCADE"), nullable=False, index=True
    )
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)

    user: Mapped["User"] = relationship(back_populates="saved_reports")
    prediction: Mapped["Prediction"] = relationship()

    def __repr__(self) -> str:
        return f"<SavedReport id={self.id} user_id={self.user_id} title={self.title!r}>"
