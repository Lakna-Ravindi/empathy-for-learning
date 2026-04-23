from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
from typing import Optional

class UserRegisterRequest(BaseModel):
    """User registration request model."""
    email: EmailStr = Field(..., description="User email address")
    password: str = Field(..., min_length=8, description="User password (min 8 characters)")
    name: str = Field(..., min_length=2, max_length=100, description="User full name")
    school: Optional[str] = Field(None, description="School or university name")

class UserLoginRequest(BaseModel):
    """User login request model."""
    email: EmailStr = Field(..., description="User email address")
    password: str = Field(..., description="User password")

class UserResponse(BaseModel):
    """User response model (no password)."""
    id: str = Field(..., description="User ID")
    email: str = Field(..., description="User email")
    name: str = Field(..., description="User name")
    school: Optional[str] = Field(None, description="School or university name")
    created_at: datetime = Field(..., description="User creation timestamp")
    updated_at: datetime = Field(..., description="Last update timestamp")

    class Config:
        json_schema_extra = {
            "example": {
                "id": "user_123abc",
                "email": "student@example.com",
                "name": "John Doe",
                "school": "University of Colombo",
                "created_at": "2026-04-23T10:00:00",
                "updated_at": "2026-04-23T10:00:00",
            }
        }

class AuthResponse(BaseModel):
    """Authentication response model."""
    access_token: str = Field(..., description="JWT access token")
    token_type: str = Field(default="bearer", description="Token type")
    user: UserResponse = Field(..., description="User information")

class ErrorResponse(BaseModel):
    """Error response model."""
    detail: str = Field(..., description="Error message")
    status_code: int = Field(..., description="HTTP status code")
