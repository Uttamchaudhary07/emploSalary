from __future__ import annotations

import bcrypt

_BCRYPT_MAX_BYTES = 72


def hash_password(plain_password: str) -> str:
    password_bytes = plain_password.encode("utf-8")[:_BCRYPT_MAX_BYTES]
    salt = bcrypt.gensalt(rounds=12)
    return bcrypt.hashpw(password_bytes, salt).decode("utf-8")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    password_bytes = plain_password.encode("utf-8")[:_BCRYPT_MAX_BYTES]
    try:
        return bcrypt.checkpw(password_bytes, hashed_password.encode("utf-8"))
    except ValueError:
        return False
