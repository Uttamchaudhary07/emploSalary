from __future__ import annotations

from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column

from app.database.base import Base, TimestampMixin, UUIDPrimaryKeyMixin


class JobRole(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    __tablename__ = "job_roles"

    title: Mapped[str] = mapped_column(String(150), unique=True, index=True, nullable=False)
    category: Mapped[str | None] = mapped_column(String(100), nullable=True)

    def __repr__(self) -> str:
        return f"<JobRole id={self.id} title={self.title!r}>"
