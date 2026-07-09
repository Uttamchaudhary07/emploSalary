from __future__ import annotations

import time
import uuid
from datetime import timedelta

import jwt as pyjwt
import pytest

from app.auth.jwt import TokenType, create_access_token, create_refresh_token, decode_token
from app.core.config import get_settings
from app.core.exceptions import InvalidTokenError, TokenExpiredError

settings = get_settings()


def test_create_and_decode_access_token_roundtrip():
    user_id = str(uuid.uuid4())
    token, jti = create_access_token(user_id, "user")

    payload = decode_token(token, TokenType.ACCESS)

    assert payload.sub == user_id
    assert payload.role == "user"
    assert payload.token_type == TokenType.ACCESS
    assert payload.jti == jti


def test_create_and_decode_refresh_token_roundtrip():
    user_id = str(uuid.uuid4())
    token, jti = create_refresh_token(user_id, "admin")

    payload = decode_token(token, TokenType.REFRESH)

    assert payload.sub == user_id
    assert payload.role == "admin"
    assert payload.token_type == TokenType.REFRESH
    assert payload.jti == jti


def test_decode_token_rejects_wrong_token_type():
    user_id = str(uuid.uuid4())
    access_token, _ = create_access_token(user_id, "user")

    with pytest.raises(InvalidTokenError):
        decode_token(access_token, TokenType.REFRESH)


def test_decode_token_rejects_malformed_token():
    with pytest.raises(InvalidTokenError):
        decode_token("not-a-real-jwt", TokenType.ACCESS)


def test_decode_token_rejects_expired_token():
    user_id = str(uuid.uuid4())
    now = time.time()
    expired_payload = {
        "sub": user_id,
        "role": "user",
        "type": TokenType.ACCESS.value,
        "jti": str(uuid.uuid4()),
        "iat": now - 120,
        "exp": now - 60,
    }
    expired_token = pyjwt.encode(expired_payload, settings.jwt_secret_key, algorithm=settings.jwt_algorithm)

    with pytest.raises(TokenExpiredError):
        decode_token(expired_token, TokenType.ACCESS)


def test_decode_token_rejects_wrong_signature():
    user_id = str(uuid.uuid4())
    token = pyjwt.encode(
        {
            "sub": user_id,
            "role": "user",
            "type": TokenType.ACCESS.value,
            "jti": str(uuid.uuid4()),
            "iat": time.time(),
            "exp": time.time() + 60,
        },
        "a-completely-different-secret",
        algorithm=settings.jwt_algorithm,
    )

    with pytest.raises(InvalidTokenError):
        decode_token(token, TokenType.ACCESS)
