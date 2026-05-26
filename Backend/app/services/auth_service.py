# app/services/auth_service.py
from app.db.database import users_collection, revoked_tokens_collection
from app.core.security import (
    hash_password,
    verify_password,
    create_access_token,
    create_refresh_token,
    verify_token,
)
from typing import Tuple, Optional, Dict
from datetime import datetime
import logging

logger = logging.getLogger(__name__)


def register_user(user_data: dict) -> Tuple[bool, str]:
    """Register a new user"""
    existing = users_collection.find_one({"username": user_data["username"]})
    if existing:
        logger.warning(f"Registration attempt with existing username: {user_data['username']}")
        return False, "Username already exists"

    user_data["password"] = hash_password(user_data["password"])
    user_data["role"] = "student"
    user_data["created_at"] = datetime.utcnow()
    user_data["is_active"] = True

    users_collection.insert_one(user_data)
    logger.info(f"New user registered: {user_data['username']}")
    return True, "Student registered successfully"


def login_user(username: str, password: str) -> Tuple[Optional[str], Optional[Dict]]:
    """Login user by username and return access token and refresh token"""
    db_user = users_collection.find_one({"username": username})

    if not db_user:
        logger.warning(f"Login attempt with non-existent username: {username}")
        return None, "Invalid credentials"

    if not verify_password(password, db_user["password"]):
        logger.warning(f"Failed login attempt for: {username}")
        return None, "Invalid credentials"

    if not db_user.get("is_active", True):
        logger.warning(f"Login attempt with inactive account: {username}")
        return None, "Account is inactive"

    # Create tokens
    token_data = {"username": db_user["username"], "role": db_user["role"]}
    access_token = create_access_token(token_data)
    refresh_token = create_refresh_token(token_data)

    # Store refresh token in database for tracking
    refresh_token_doc = {
        "token": refresh_token,
        "username": username,
        "created_at": datetime.utcnow(),
        "is_revoked": False
    }
    # You could store this if you want to track refresh tokens, but it's optional

    logger.info(f"User logged in: {username}")

    # Return both tokens to the client
    return {"access_token": access_token, "refresh_token": refresh_token}, {
        "username": db_user["username"],
        "role": db_user["role"],
    }


def refresh_access_token(refresh_token: str) -> Tuple[Optional[str], str]:
    """
    Validate refresh token and return new access token
    """
    payload = verify_token(refresh_token)

    if not payload:
        logger.warning("Refresh attempt with invalid token")
        return None, "Invalid or expired refresh token"

    # Verify token type is "refresh"
    if payload.get("type") != "refresh":
        logger.warning("Non-refresh token used for refresh endpoint")
        return None, "Invalid token type"

    # Verify user still exists and is active
    username = payload.get("username")
    user = users_collection.find_one({"username": username})

    if not user or not user.get("is_active", True):
        logger.warning(f"Refresh attempt for inactive/non-existent user: {username}")
        return None, "User account not found or inactive"

    # Create new access token
    token_data = {"username": user["username"], "role": user["role"]}
    new_access_token = create_access_token(token_data)

    logger.info(f"Access token refreshed for: {username}")
    return new_access_token, "Access token refreshed successfully"


def logout_user(token: str, username: str) -> Tuple[bool, str]:
    """
    Revoke a token (logout)
    """
    revoked_token_doc = {
        "token": token,
        "username": username,
        "revoked_at": datetime.utcnow(),
    }
    revoked_tokens_collection.insert_one(revoked_token_doc)
    logger.info(f"User logged out: {username}")
    return True, "Logged out successfully"