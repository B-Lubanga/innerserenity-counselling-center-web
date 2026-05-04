from sqlalchemy import Column, Integer, String, Numeric, Text
from app.db.base import Base


class ServiceType(Base):
    __tablename__ = "service_types"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False, unique=True)  # individual, couples, group, online
    description = Column(Text)
    duration_minutes = Column(Integer, nullable=False)
    base_price = Column(Numeric(10, 2), nullable=False)

    def __repr__(self):
        return f"<ServiceType(id={self.id}, name='{self.name}', price={self.base_price})>"
