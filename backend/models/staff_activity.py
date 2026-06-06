from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from datetime import datetime

from database.base import Base


class StaffActivity(Base):
    __tablename__ = "staff_activity"

    id = Column(Integer, primary_key=True, index=True)
    staff_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    action = Column(String(100), nullable=False)
    action_type = Column(String(50), nullable=False)
    details = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
