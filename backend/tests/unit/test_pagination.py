from __future__ import annotations

from app.utils.pagination import Page, PaginationParams


def test_pagination_params_computes_offset():
    params = PaginationParams(page=3, page_size=10)
    assert params.offset == 20
    assert params.limit == 10


def test_pagination_params_first_page_has_zero_offset():
    params = PaginationParams(page=1, page_size=25)
    assert params.offset == 0


def test_page_pages_rounds_up():
    page = Page(items=[1, 2, 3], total=25, page=1, page_size=10)
    assert page.pages == 3


def test_page_pages_is_at_least_one_when_empty():
    page = Page(items=[], total=0, page=1, page_size=10)
    assert page.pages == 1


def test_page_pages_exact_multiple():
    page = Page(items=[], total=20, page=1, page_size=10)
    assert page.pages == 2
