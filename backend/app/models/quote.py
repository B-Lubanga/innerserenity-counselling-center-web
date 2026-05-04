from sqlalchemy import Column, Integer, String, DateTime, Numeric, Text, ForeignKey, Enum as SQLEnum
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.db.base import Base
import enum


class QuoteStatus(str, enum.Enum):
    DRAFT = "draft"
    SENT = "sent"
    ACCEPTED = "accepted"
    DECLINED = "declined"
    EXPIRED = "expired"


class Quote(Base):
    __tablename__ = "quotes"

    id = Column(Integer, primary_key=True, index=True)
    client_id = Column(Integer, ForeignKey("clients.id"), nullable=True)  # Nullable for anonymous quotes
    service_type_id = Column(Integer, ForeignKey("service_types.id"), nullable=False)
    details = Column(JSONB)  # Flexible JSON structure for quote details
    estimated_price = Column(Numeric(10, 2), nullable=False)
    status = Column(SQLEnum(QuoteStatus), default=QuoteStatus.DRAFT)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    client = relationship("Client", backref="quotes")
    service_type = relationship("ServiceType", backref="quotes")

    def __repr__(self):
        return f"<Quote(id={self.id}, client_id={self.client_id}, estimated_price={self.estimated_price}, status='{self.status}')>"
