from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
from typing import Optional
from decimal import Decimal


class ClientBase(BaseModel):
    """Base schema for client data."""
    first_name: str = Field(..., min_length=1, max_length=255)
    last_name: str = Field(..., min_length=1, max_length=255)
    email: EmailStr
    phone: Optional[str] = Field(None, max_length=50)
    date_of_birth: Optional[datetime] = None
    emergency_contact: Optional[str] = Field(None, max_length=255)
    notes: Optional[str] = None


class ClientCreate(ClientBase):
    """Schema for creating a new client."""
    pass


class ClientUpdate(BaseModel):
    """Schema for updating a client."""
    first_name: Optional[str] = Field(None, min_length=1, max_length=255)
    last_name: Optional[str] = Field(None, min_length=1, max_length=255)
    email: Optional[EmailStr] = None
    phone: Optional[str] = Field(None, max_length=50)
    date_of_birth: Optional[datetime] = None
    emergency_contact: Optional[str] = Field(None, max_length=255)
    notes: Optional[str] = None
    is_active: Optional[bool] = None


class ClientResponse(ClientBase):
    """Response schema for client data."""
    id: int
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True


class SessionHistoryItem(BaseModel):
    """Schema for a session in client history."""
    id: int
    session_date: datetime
    goals: Optional[str] = None
    progress: Optional[str] = None
    next_steps: Optional[str] = None


class InvoiceHistoryItem(BaseModel):
    """Schema for an invoice in client history."""
    id: int
    invoice_number: str
    amount: Decimal
    status: str
    issued_at: Optional[datetime] = None
    due_at: Optional[datetime] = None
    paid_at: Optional[datetime] = None


class ClientHistory(BaseModel):
    """Schema for client's complete history."""
    client: ClientResponse
    sessions: list[SessionHistoryItem]
    invoices: list[InvoiceHistoryItem]

