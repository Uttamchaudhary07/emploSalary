from __future__ import annotations

from fastapi import APIRouter, Depends, status

from app.api.deps import get_auth_service, get_current_active_user
from app.models.user import User
from app.schemas.auth import (
    ForgotPasswordRequest,
    LoginRequest,
    LogoutRequest,
    RefreshRequest,
    RegisterRequest,
    RegisterResponse,
    ResetPasswordRequest,
    TokenResponse,
    VerifyEmailRequest,
)
from app.schemas.common import MessageResponse
from app.schemas.user import UserRead
from app.services.auth_service import AuthService

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register", response_model=RegisterResponse, status_code=status.HTTP_201_CREATED)
async def register(
    payload: RegisterRequest, auth_service: AuthService = Depends(get_auth_service)
) -> RegisterResponse:
    user, tokens = await auth_service.register(payload)
    return RegisterResponse(user=UserRead.model_validate(user), tokens=tokens)


@router.post("/login", response_model=TokenResponse)
async def login(
    payload: LoginRequest, auth_service: AuthService = Depends(get_auth_service)
) -> TokenResponse:
    _, tokens = await auth_service.login(payload.email, payload.password)
    return tokens


@router.post("/refresh", response_model=TokenResponse)
async def refresh(
    payload: RefreshRequest, auth_service: AuthService = Depends(get_auth_service)
) -> TokenResponse:
    return await auth_service.refresh(payload.refresh_token)


@router.post("/logout", response_model=MessageResponse)
async def logout(
    payload: LogoutRequest, auth_service: AuthService = Depends(get_auth_service)
) -> MessageResponse:
    await auth_service.logout(payload.refresh_token)
    return MessageResponse(message="Logged out successfully.")


@router.post("/forgot-password", response_model=MessageResponse)
async def forgot_password(
    payload: ForgotPasswordRequest, auth_service: AuthService = Depends(get_auth_service)
) -> MessageResponse:
    await auth_service.forgot_password(payload.email)
    return MessageResponse(
        message="If an account with that email exists, a password reset link has been sent."
    )


@router.post("/reset-password", response_model=MessageResponse)
async def reset_password(
    payload: ResetPasswordRequest, auth_service: AuthService = Depends(get_auth_service)
) -> MessageResponse:
    await auth_service.reset_password(payload.token, payload.new_password)
    return MessageResponse(message="Password has been reset successfully.")


@router.post("/email-verification/request", response_model=MessageResponse)
async def request_email_verification(
    current_user: User = Depends(get_current_active_user),
    auth_service: AuthService = Depends(get_auth_service),
) -> MessageResponse:
    await auth_service.send_email_verification(current_user)
    return MessageResponse(message="Verification email has been sent.")


@router.post("/email-verification/confirm", response_model=MessageResponse)
async def confirm_email_verification(
    payload: VerifyEmailRequest, auth_service: AuthService = Depends(get_auth_service)
) -> MessageResponse:
    await auth_service.verify_email(payload.token)
    return MessageResponse(message="Email verified successfully.")
