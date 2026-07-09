from __future__ import annotations

import hashlib
import re
import secrets

_CONTROL_CHARS_RE = re.compile(r"[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]")


def hash_token(raw_token: str) -> str:
    """One-way hash used to store JWT refresh/reset tokens at rest."""
    return hashlib.sha256(raw_token.encode("utf-8")).hexdigest()


def generate_secure_token(num_bytes: int = 32) -> str:
    return secrets.token_urlsafe(num_bytes)


def sanitize_text(value: str, *, max_length: int = 2000) -> str:
    """Strip control characters and clamp length for free-text user input."""
    cleaned = _CONTROL_CHARS_RE.sub("", value).strip()
    return cleaned[:max_length]
