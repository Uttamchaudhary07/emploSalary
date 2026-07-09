from __future__ import annotations

import uuid
from datetime import datetime

from fastapi import APIRouter, Depends, Query, status

from app.api.deps import get_current_active_user, get_prediction_service
from app.models.user import User
from app.schemas.common import PageResponse
from app.schemas.prediction import (
    PredictionCreateRequest,
    PredictionFilterParams,
    PredictionHistoryEventRead,
    PredictionRead,
)
from app.services.prediction_service import PredictionService
from app.utils.pagination import PaginationParams

router = APIRouter(prefix="/predictions", tags=["Prediction"])


@router.post("/predict", response_model=PredictionRead, status_code=status.HTTP_201_CREATED)
async def create_prediction(
    payload: PredictionCreateRequest,
    current_user: User = Depends(get_current_active_user),
    prediction_service: PredictionService = Depends(get_prediction_service),
) -> PredictionRead:
    prediction = await prediction_service.create_prediction(current_user, payload)
    return PredictionRead.model_validate(prediction)


@router.get("/history", response_model=PageResponse[PredictionRead], tags=["Prediction History"])
async def list_prediction_history(
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, ge=1, le=100),
    job_role_id: uuid.UUID | None = None,
    location_id: uuid.UUID | None = None,
    search: str | None = None,
    date_from: datetime | None = None,
    date_to: datetime | None = None,
    current_user: User = Depends(get_current_active_user),
    prediction_service: PredictionService = Depends(get_prediction_service),
) -> PageResponse[PredictionRead]:
    result_page = await prediction_service.list_history(
        current_user,
        PaginationParams(page=page, page_size=page_size),
        PredictionFilterParams(
            job_role_id=job_role_id,
            location_id=location_id,
            search=search,
            date_from=date_from,
            date_to=date_to,
        ),
    )
    return PageResponse.from_page(result_page, PredictionRead.model_validate)


@router.get("/{prediction_id}", response_model=PredictionRead)
async def get_prediction(
    prediction_id: uuid.UUID,
    current_user: User = Depends(get_current_active_user),
    prediction_service: PredictionService = Depends(get_prediction_service),
) -> PredictionRead:
    prediction = await prediction_service.get_prediction(current_user, prediction_id)
    return PredictionRead.model_validate(prediction)


@router.get(
    "/{prediction_id}/history",
    response_model=list[PredictionHistoryEventRead],
    tags=["Prediction History"],
)
async def get_prediction_audit_trail(
    prediction_id: uuid.UUID,
    current_user: User = Depends(get_current_active_user),
    prediction_service: PredictionService = Depends(get_prediction_service),
) -> list[PredictionHistoryEventRead]:
    events = await prediction_service.get_audit_trail(current_user, prediction_id)
    return [PredictionHistoryEventRead.model_validate(event) for event in events]
