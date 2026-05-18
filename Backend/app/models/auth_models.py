# app/models/auth_models.py
from pydantic import BaseModel, EmailStr
from typing import Optional


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    """Token response model"""
    access_token: str
    refresh_token: Optional[str] = None
    token_type: str = "bearer"


class TokenRefreshRequest(BaseModel):
    """Request model for token refresh"""
    refresh_token: str


class TokenPayload(BaseModel):
    """JWT token payload"""
    email: str
    role: str
    type: str  # "access" or "refresh"
    exp: Optional[int] = None


class CurrentUser(BaseModel):
    """Current authenticated user model"""
    email: EmailStr
    role: str