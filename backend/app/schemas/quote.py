from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional, Any
from decimal import Decimal
from app.models import QuoteStatus


class QuoteBase(BaseModel):
    """Base schema for price quote data."""
    client_id: Optional[int] = None
    service_type_id: int
    details: Optional[dict] = None
    estimated_price: Decimal = Field(..., ge=0)


class QuoteCreate(QuoteBase):
    """Schema for creating a new price quote."""
    pass


class QuoteUpdate(BaseModel):
    """Schema for updating a price quote."""
    estimated_price: Optional[Decimal] = Field(None, ge=0)
    status: Optional[QuoteStatus] = None
    details: Optional[dict] = None


class QuoteResponse(QuoteBase):
    """Response schema for price quote data."""
    id: int
    status: QuoteStatus
    created_at: datetime

    class Config:
        from_attributes = True


class QuoteWithDetails(QuoteResponse):
    """Quote response with related data."""
    client_name: Optional[str] = None
    service_type_name: str

