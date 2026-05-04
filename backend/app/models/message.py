from sqlalchemy import Column, Integer, String, DateTime, Text, ForeignKey, Enum as SQLEnum
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.db.base import Base
import enum


class SenderType(str, enum.Enum):
    CLIENT = "client"
    BOT = "bot"
    ADMIN = "admin"


class Message(Base):
    __tablename__ = "messages"

    id = Column(Integer, primary_key=True, index=True)
    client_id = Column(Integer, ForeignKey("clients.id"), nullable=True)  # Nullable for anonymous
    sender_type = Column(SQLEnum(SenderType), nullable=False)
    content = Column(Text, nullable=False)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    session_id = Column(String(255), index=True)  # For threading messages

    # Relationship
    client = relationship("Client", backref="messages")

    def __repr__(self):
        return f"<Message(id={self.id}, sender_type='{self.sender_type}', session_id='{self.session_id}')>"
