from pydantic import BaseModel, Field
from datetime import datetime
from decimal import Decimal
from typing import Optional
from app.models import InvoiceStatus


class InvoiceBase(BaseModel):
    """Base schema for invoice data."""
    client_id: int
    amount: Decimal = Field(..., ge=0)
    booking_id: Optional[int] = None
    template_used: Optional[str] = None
    due_at: Optional[datetime] = None


class InvoiceCreate(InvoiceBase):
    """Schema for creating a new invoice."""
    pass


class InvoiceUpdate(BaseModel):
    """Schema for updating an invoice."""
    amount: Optional[Decimal] = Field(None, ge=0)
    status: Optional[InvoiceStatus] = None
    template_used: Optional[str] = None
    due_at: Optional[datetime] = None


class InvoiceResponse(InvoiceBase):
    """Response schema for invoice data."""
    id: int
    invoice_number: str
    status: InvoiceStatus
    issued_at: Optional[datetime] = None
    due_at: Optional[datetime] = None
    paid_at: Optional[datetime] = None
    created_at: datetime

    class Config:
        from_attributes = True


class InvoiceWithDetails(InvoiceResponse):
    """Invoice response with related data."""
    client_name: str
    client_email: str

