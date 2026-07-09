from __future__ import annotations

import math
from dataclasses import dataclass
from typing import Generic, Sequence, TypeVar

from pydantic import BaseModel, Field

T = TypeVar("T")


class PaginationParams(BaseModel):
    page: int = Field(default=1, ge=1)
    page_size: int = Field(default=20, ge=1, le=100)

    @property
    def offset(self) -> int:
        return (self.page - 1) * self.page_size

    @property
    def limit(self) -> int:
        return self.page_size


@dataclass(frozen=True)
class Page(Generic[T]):
    items: Sequence[T]
    total: int
    page: int
    page_size: int

    @property
    def pages(self) -> int:
        return max(1, math.ceil(self.total / self.page_size)) if self.page_size else 1
