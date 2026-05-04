from sqlalchemy import Column, Integer, String, DateTime, Text, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.db.base import Base


class SessionReport(Base):
    __tablename__ = "session_reports"

    id = Column(Integer, primary_key=True, index=True)
    booking_id = Column(Integer, ForeignKey("bookings.id"), nullable=False)
    counsellor_id = Column(Integer, ForeignKey("staff.id"), nullable=False)
    client_id = Column(Integer, ForeignKey("clients.id"), nullable=False)
    session_date = Column(DateTime(timezone=True), nullable=False)
    notes = Column(Text)  # Encrypted in production
    goals = Column(Text)
    progress = Column(Text)
    next_steps = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    booking = relationship("Booking", backref="session_report")
    counsellor = relationship("Staff", backref="session_reports")
    client = relationship("Client", backref="session_reports")

    def __repr__(self):
        return f"<SessionReport(id={self.id}, booking_id={self.booking_id}, session_date='{self.session_date}')>"
