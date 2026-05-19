# app/models/profile_models.py
from pydantic import BaseModel, Field
from typing import Optional
from enum import Enum


class EducationLevelEnum(str, Enum):
    """Education level options"""
    OL = "O-Levels"
    AL = "A-Levels"
    UNDERGRADUATE = "Undergraduate"
    OTHER = "Other"


class DistrictEnum(str, Enum):
    """Sri Lankan districts"""
    AMPARA = "Ampara"
    ANURADHAPURA = "Anuradhapura"
    BADULLA = "Badulla"
    BATTICALOA = "Batticaloa"
    COLOMBO = "Colombo"
    GALLE = "Galle"
    GAMPAHA = "Gampaha"
    JAFFNA = "Jaffna"
    KALUTARA = "Kalutara"
    KANDY = "Kandy"
    KEGALLE = "Kegalle"
    KILINOCHCHI = "Kilinochchi"
    KURUNEGALA = "Kurunegala"
    MADURAI = "Madurai"
    MATARA = "Matara"
    MATOTOTA = "Matotota"
    MONARAGALA = "Monaragala"
    MULLAITIVU = "Mullaitivu"
    NUWARA_ELIYA = "Nuwara Eliya"
    POLONNARUWA = "Polonnaruwa"
    PUTTALAM = "Puttalam"
    RATNAPURA = "Ratnapura"
    TRINCOMALEE = "Trincomalee"
    VAVUNIYA = "Vavuniya"
    WESTERN = "Western"


class ProfileCreate(BaseModel):
    """Profile creation model"""
    educationLevel: EducationLevelEnum = Field(..., description="Education level")
    age: int = Field(..., ge=1, le=120, description="Age in years")
    district: DistrictEnum = Field(..., description="District of residence")


class ProfileUpdate(BaseModel):
    """Profile update model"""
    educationLevel: Optional[EducationLevelEnum] = None
    age: Optional[int] = Field(None, ge=1, le=120, description="Age in years")
    district: Optional[DistrictEnum] = None


class ProfileResponse(BaseModel):
    """Profile response model"""
    educationLevel: EducationLevelEnum
    age: int
    district: DistrictEnum

    class Config:
        from_attributes = True
