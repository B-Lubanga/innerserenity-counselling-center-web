from pydantic import BaseModel, Field
from datetime import datetime, date, time
from typing import Optional


class AvailabilityBase(BaseModel):
    """Base schema for availability data."""
    counsellor_id: int
    day_of_week: str = Field(..., pattern="^(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)$")
    start_time: str = Field(..., pattern="^([01]?[0-9]|2[0-3]):[0-5][0-9]$")
    end_time: str = Field(..., pattern="^([01]?[0-9]|2[0-3]):[0-5][0-9]$")
    is_active: bool = True


class AvailabilityCreate(AvailabilityBase):
    """Schema for creating availability."""
    pass


class AvailabilityUpdate(BaseModel):
    """Schema for updating availability."""
    start_time: Optional[str] = Field(None, pattern="^([01]?[0-9]|2[0-3]):[0-5][0-9]$")
    end_time: Optional[str] = Field(None, pattern="^([01]?[0-9]|2[0-3]):[0-5][0-9]$")
    is_active: Optional[bool] = None


class AvailabilityResponse(AvailabilityBase):
    """Response schema for availability data."""
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


class AvailabilitySlot(BaseModel):
    """Schema for an available time slot."""
    date: date
    day_of_week: str
    start_time: time
    end_time: time
    is_available: bool
