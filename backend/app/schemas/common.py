from __future__ import annotations

from typing import Generic, TypeVar

from pydantic import BaseModel

T = TypeVar("T")


class MessageResponse(BaseModel):
    message: str


class PageResponse(BaseModel, Generic[T]):
    items: list[T]
    total: int
    page: int
    page_size: int
    pages: int

    @classmethod
    def from_page(cls, page, item_adapter=lambda item: item) -> "PageResponse[T]":
        return cls(
            items=[item_adapter(item) for item in page.items],
            total=page.total,
            page=page.page,
            page_size=page.page_size,
            pages=page.pages,
        )
