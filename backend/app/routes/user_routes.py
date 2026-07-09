from __future__ import annotations

from fastapi import APIRouter, Depends

from app.api.deps import get_current_active_user, get_user_service
from app.models.user import User
from app.schemas.common import MessageResponse
from app.schemas.user import ChangePasswordRequest, UserRead, UserUpdate
from app.services.user_service import UserService

router = APIRouter(prefix="/users", tags=["User Profile"])


@router.get("/me", response_model=UserRead)
async def get_my_profile(current_user: User = Depends(get_current_active_user)) -> UserRead:
    return UserRead.model_validate(current_user)


@router.patch("/me", response_model=UserRead)
async def update_my_profile(
    payload: UserUpdate,
    current_user: User = Depends(get_current_active_user),
    user_service: UserService = Depends(get_user_service),
) -> UserRead:
    updated = await user_service.update_profile(current_user, payload)
    return UserRead.model_validate(updated)


@router.post("/me/change-password", response_model=MessageResponse)
async def change_my_password(
    payload: ChangePasswordRequest,
    current_user: User = Depends(get_current_active_user),
    user_service: UserService = Depends(get_user_service),
) -> MessageResponse:
    await user_service.change_password(current_user, payload.current_password, payload.new_password)
    return MessageResponse(message="Password changed successfully.")
