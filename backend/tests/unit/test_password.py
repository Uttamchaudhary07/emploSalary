from __future__ import annotations

from app.auth.password import hash_password, verify_password


def test_hash_password_produces_different_hash_than_input():
    hashed = hash_password("SecurePass123")
    assert hashed != "SecurePass123"


def test_verify_password_succeeds_for_correct_password():
    hashed = hash_password("SecurePass123")
    assert verify_password("SecurePass123", hashed) is True


def test_verify_password_fails_for_incorrect_password():
    hashed = hash_password("SecurePass123")
    assert verify_password("WrongPassword", hashed) is False


def test_hash_password_is_salted_and_nondeterministic():
    first = hash_password("SecurePass123")
    second = hash_password("SecurePass123")
    assert first != second
    assert verify_password("SecurePass123", first)
    assert verify_password("SecurePass123", second)


def test_verify_password_rejects_malformed_hash():
    assert verify_password("SecurePass123", "not-a-real-bcrypt-hash") is False
