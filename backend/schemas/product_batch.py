from pydantic import BaseModel
from datetime import date


class ProductBatchCreate(
    BaseModel
):

    product_id: int

    batch_no: str

    quantity: int

    manufacturing_date: date

    expiry_date: date