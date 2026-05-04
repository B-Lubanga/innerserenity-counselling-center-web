from sqlalchemy import Column, Integer, String, DateTime, Enum as SQLEnum
from sqlalchemy.sql import func
from app.db.base import Base
import enum


class Role(str, enum.Enum):
    ADMIN = "admin"
    COUNSELLOR = "counsellor"


class Staff(Base):
    __tablename__ = "staff"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, nullable=False, index=True)
    hashed_password = Column(String(255), nullable=False)
    role = Column(SQLEnum(Role), nullable=False, default=Role.COUNSELLOR)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    def __repr__(self):
        return f"<Staff(id={self.id}, name='{self.name}', email='{self.email}', role='{self.role}')>"
