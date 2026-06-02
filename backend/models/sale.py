from sqlalchemy import Column, Integer, Float, String, DateTime
from datetime import datetime

from database.base import Base


class Sale(Base):
    __tablename__ = "sales"

    id = Column(Integer, primary_key=True, index=True)

    invoice_number = Column(
        String(50),
        unique=True,
        nullable=False
    )

    total_amount = Column(
        Float,
        nullable=False
    )

    payment_received = Column(
        Float,
        nullable=False
    )

    change_returned = Column(
        Float,
        nullable=False
    )

    created_by = Column(
        Integer,
        nullable=False
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )