from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
from decimal import Decimal
from typing import Optional
from app.models import Role


class StaffLoginRequest(BaseModel):
    """Request schema for staff login."""
    email: EmailStr
    password: str


class StaffLoginResponse(BaseModel):
    """Response schema for staff login."""
    access_token: str
    token_type: str
    user: "StaffResponse"


class StaffCreate(BaseModel):
    """Schema for creating a new staff member."""
    name: str = Field(..., min_length=1, max_length=255)
    email: EmailStr
    password: str = Field(..., min_length=8)
    role: Role = Role.COUNSELLOR


class StaffUpdate(BaseModel):
    """Schema for updating a staff member."""
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    email: Optional[EmailStr] = None
    password: Optional[str] = Field(None, min_length=8)
    role: Optional[Role] = None


class StaffResponse(BaseModel):
    """Response schema for staff data."""
    id: int
    name: str
    email: str
    role: Role
    created_at: datetime

    class Config:
        from_attributes = True


class DashboardStats(BaseModel):
    """Dashboard statistics response."""
    total_clients: int
    total_staff: int
    active_bookings: int
    pending_bookings: int
    completed_sessions: int
    revenue_this_month: Decimal


# Forward reference resolution
StaffLoginResponse.model_rebuild()

