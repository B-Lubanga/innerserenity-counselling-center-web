from sqlalchemy import Column, Integer, String, DateTime, Boolean, Text, TIMESTAMP
from sqlalchemy.sql import func
from app.db.base import Base


class Client(Base):
    __tablename__ = "clients"

    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String(255), nullable=False)
    last_name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, nullable=False, index=True)
    phone = Column(String(50))
    date_of_birth = Column(DateTime)
    emergency_contact = Column(String(255))
    notes = Column(Text)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Authentication fields
    hashed_password = Column(String(255), nullable=True)
    google_id = Column(String(255), nullable=True, unique=True)
    auth_provider = Column(String(50), default='local')  # local, google, facebook
    is_verified = Column(Boolean, default=False)
    verification_token = Column(String(255), nullable=True)
    reset_token = Column(String(255), nullable=True)
    reset_token_expires = Column(TIMESTAMP(timezone=True), nullable=True)
    last_login = Column(DateTime(timezone=True), nullable=True)

    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}"

    def __repr__(self):
        return f"<Client(id={self.id}, name='{self.full_name}', email='{self.email}')>"
