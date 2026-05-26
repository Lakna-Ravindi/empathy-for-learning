# app/models/user_models.py
from pydantic import BaseModel, Field, field_validator
from app.core.validators import validate_password


class UserRegister(BaseModel):
    username: str = Field(..., min_length=3, max_length=50, description="Username for login")
    password: str = Field(..., min_length=8, description="Must include uppercase, lowercase, numbers, and symbols")
    age: int = Field(..., ge=1, le=120, description="Age in years")
    privacyConsent: bool = Field(..., description="Must be true to register")

    @field_validator("password")
    @classmethod
    def validate_password_strength(cls, v):
        validate_password(v)
        return v

    @field_validator("privacyConsent")
    @classmethod
    def check_privacy_consent(cls, v):
        if not v:
            raise ValueError("Privacy consent must be accepted to register")
        return v


class UserResponse(BaseModel):
    """User response model (without sensitive data)"""
    username: str
    age: int

    class Config:
        from_attributes = True