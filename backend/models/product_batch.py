from sqlalchemy import (
    Column,
    Integer,
    String,
    Date,
    DateTime,
    ForeignKey
)

from datetime import datetime

from database.base import Base

from sqlalchemy import Boolean

class ProductBatch(Base):

    __tablename__ = "product_batches"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    product_id = Column(
        Integer,
        ForeignKey("products.id")
    )

    batch_no = Column(
        String(100),
        nullable=False
    )

    quantity = Column(
        Integer,
        nullable=False
    )

    manufacturing_date = Column(
        Date,
        nullable=False
    )

    expiry_date = Column(
        Date,
        nullable=False
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )

    disposed = Column(
        Boolean,
        default=False
    )

    front_shelf = Column(
        Boolean,
        default=False
    )
