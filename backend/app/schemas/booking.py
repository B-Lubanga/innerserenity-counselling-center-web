from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional
from app.models import BookingStatus


class BookingBase(BaseModel):
    """Base schema for booking data."""
    client_id: int
    counsellor_id: int
    service_type_id: int
    scheduled_at: datetime
    notes: Optional[str] = None


class BookingCreate(BookingBase):
    """Schema for creating a new booking."""
    pass


class BookingUpdate(BaseModel):
    """Schema for updating a booking."""
    scheduled_at: Optional[datetime] = None
    status: Optional[BookingStatus] = None
    notes: Optional[str] = None


class BookingResponse(BookingBase):
    """Response schema for booking data."""
    id: int
    status: BookingStatus
    created_at: datetime

    class Config:
        from_attributes = True


class BookingWithDetails(BookingResponse):
    """Booking response with related data."""
    client_name: str
    client_email: str
    counsellor_name: str
    service_type_name: str
    meeting_url: Optional[str] = None

