# app/models/user_models.py
from pydantic import BaseModel, EmailStr, Field, field_validator
from typing import Optional
from app.core.validators import validate_password, validate_phone_number, validate_district
from app.models.profile_models import EducationLevelEnum, DistrictEnum


class UserRegister(BaseModel):
    fullName: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    phoneNumber: str = Field(..., description="Sri Lankan phone format: +94XXXXXXXXX")
    password: str = Field(..., min_length=8, description="Must include uppercase, lowercase, numbers, and symbols")
    educationLevel: EducationLevelEnum = Field(..., description="Education level")
    age: int = Field(..., ge=1, le=120, description="Age in years")
    schoolOrUniversity: Optional[str] = None
    district: DistrictEnum = Field(..., description="District of residence")
    privacyConsent: bool = Field(..., description="Must be true to register")

    @field_validator("password")
    @classmethod
    def validate_password_strength(cls, v):
        validate_password(v)
        return v

    @field_validator("phoneNumber")
    @classmethod
    def validate_phone(cls, v):
        validate_phone_number(v)
        return v

    @field_validator("privacyConsent")
    @classmethod
    def check_privacy_consent(cls, v):
        if not v:
            raise ValueError("Privacy consent must be accepted to register")
        return v


class UserResponse(BaseModel):
    """User response model (without sensitive data)"""
    fullName: str
    email: EmailStr
    phoneNumber: str
    educationLevel: EducationLevelEnum
    age: int
    schoolOrUniversity: Optional[str] = None
    district: DistrictEnum

    class Config:
        from_attributes = True