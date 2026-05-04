from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional


class SessionReportBase(BaseModel):
    """Base schema for session report data."""
    booking_id: int
    counsellor_id: int
    client_id: int
    session_date: datetime
    notes: Optional[str] = None
    goals: Optional[str] = None
    progress: Optional[str] = None
    next_steps: Optional[str] = None


class SessionReportCreate(SessionReportBase):
    """Schema for creating a new session report."""
    pass


class SessionReportUpdate(BaseModel):
    """Schema for updating a session report."""
    session_date: Optional[datetime] = None
    notes: Optional[str] = None
    goals: Optional[str] = None
    progress: Optional[str] = None
    next_steps: Optional[str] = None


class SessionReportResponse(SessionReportBase):
    """Response schema for session report data."""
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


class SessionReportWithDetails(SessionReportResponse):
    """Session report response with related data."""
    client_name: str
    counsellor_name: str

