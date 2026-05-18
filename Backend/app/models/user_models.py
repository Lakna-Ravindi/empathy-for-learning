# app/models/user_models.py
from pydantic import BaseModel, EmailStr, Field
from typing import Optional

class UserRegister(BaseModel):
    fullName: str
    email: EmailStr
    phoneNumber: str
    password: str = Field(min_length=8)
    educationLevel: str
    ageGroup: str
    schoolOrUniversity: Optional[str] = None
    district: Optional[str] = None
    privacyConsent: bool