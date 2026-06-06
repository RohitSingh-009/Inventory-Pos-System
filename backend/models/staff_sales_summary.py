from sqlalchemy import Column, Integer, Float, DateTime, ForeignKey
from datetime import datetime

from database.base import Base


class StaffSalesSummary(Base):
    __tablename__ = "staff_sales_summary"

    id = Column(Integer, primary_key=True, index=True)
    staff_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    total_orders = Column(Integer, default=0)
    total_revenue = Column(Float, default=0.0)
    average_bill_value = Column(Float, default=0.0)
    last_sale_time = Column(DateTime, nullable=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
