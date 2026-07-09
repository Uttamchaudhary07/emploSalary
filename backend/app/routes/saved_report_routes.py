from __future__ import annotations

import uuid

from fastapi import APIRouter, Depends, Query, status

from app.api.deps import get_current_active_user, get_saved_report_service
from app.models.user import User
from app.schemas.common import PageResponse
from app.schemas.saved_report import SavedReportCreateRequest, SavedReportRead
from app.services.saved_report_service import SavedReportService
from app.utils.pagination import PaginationParams

router = APIRouter(prefix="/reports", tags=["Saved Reports"])


@router.post("", response_model=SavedReportRead, status_code=status.HTTP_201_CREATED)
async def create_saved_report(
    payload: SavedReportCreateRequest,
    current_user: User = Depends(get_current_active_user),
    report_service: SavedReportService = Depends(get_saved_report_service),
) -> SavedReportRead:
    report = await report_service.create(current_user, payload)
    return SavedReportRead.model_validate(report)


@router.get("", response_model=PageResponse[SavedReportRead])
async def list_saved_reports(
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, ge=1, le=100),
    current_user: User = Depends(get_current_active_user),
    report_service: SavedReportService = Depends(get_saved_report_service),
) -> PageResponse[SavedReportRead]:
    result_page = await report_service.list_for_user(
        current_user, PaginationParams(page=page, page_size=page_size)
    )
    return PageResponse.from_page(result_page, SavedReportRead.model_validate)


@router.get("/{report_id}", response_model=SavedReportRead)
async def get_saved_report(
    report_id: uuid.UUID,
    current_user: User = Depends(get_current_active_user),
    report_service: SavedReportService = Depends(get_saved_report_service),
) -> SavedReportRead:
    report = await report_service.get(current_user, report_id)
    return SavedReportRead.model_validate(report)


@router.delete("/{report_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_saved_report(
    report_id: uuid.UUID,
    current_user: User = Depends(get_current_active_user),
    report_service: SavedReportService = Depends(get_saved_report_service),
) -> None:
    await report_service.delete(current_user, report_id)
