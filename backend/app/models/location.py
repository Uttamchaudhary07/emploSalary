from __future__ import annotations

from sqlalchemy import String, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column

from app.database.base import Base, TimestampMixin, UUIDPrimaryKeyMixin


class Location(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    __tablename__ = "locations"
    __table_args__ = (UniqueConstraint("city", "state", "country", name="uq_location_city_state_country"),)

    city: Mapped[str] = mapped_column(String(120), nullable=False, index=True)
    state: Mapped[str | None] = mapped_column(String(120), nullable=True)
    country: Mapped[str] = mapped_column(String(120), nullable=False, index=True)

    def __repr__(self) -> str:
        return f"<Location id={self.id} city={self.city!r} country={self.country!r}>"
