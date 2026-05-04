from sqlalchemy import Column, Integer, String, DateTime, Numeric, Text, ForeignKey, Enum as SQLEnum
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.db.base import Base
import enum


class InvoiceStatus(str, enum.Enum):
    DRAFT = "draft"
    SENT = "sent"
    PAID = "paid"
    OVERDUE = "overdue"


class Invoice(Base):
    __tablename__ = "invoices"

    id = Column(Integer, primary_key=True, index=True)
    invoice_number = Column(String(20), unique=True, nullable=False, index=True)  # 001, 002, etc.
    client_id = Column(Integer, ForeignKey("clients.id"), nullable=False)
    booking_id = Column(Integer, ForeignKey("bookings.id"), nullable=True)
    amount = Column(Numeric(10, 2), nullable=False)
    status = Column(SQLEnum(InvoiceStatus), default=InvoiceStatus.DRAFT)
    template_used = Column(String(255))
    issued_at = Column(DateTime(timezone=True))
    due_at = Column(DateTime(timezone=True))
    paid_at = Column(DateTime(timezone=True))
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    client = relationship("Client", backref="invoices")
    booking = relationship("Booking", backref="invoice")

    def __repr__(self):
        return f"<Invoice(id={self.id}, invoice_number='{self.invoice_number}', amount={self.amount}, status='{self.status}')>"
