from sqlalchemy import (
    Column,
    Integer,
    String,
    Float,
    DateTime,
    ForeignKey
)

from datetime import datetime

from database.base import Base


class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String(150), nullable=False)

    barcode = Column(
        String(50),
        unique=True,
        nullable=False
    )

    category_id = Column(
        Integer,
        ForeignKey("categories.id")
    )

    buying_price = Column(Float, nullable=False)

    selling_price = Column(Float, nullable=False)

    stock_quantity = Column(
        Integer,
        default=0
    )

    low_stock_limit = Column(
        Integer,
        default=10
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )