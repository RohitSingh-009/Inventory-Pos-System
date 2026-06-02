from pydantic import BaseModel
from typing import List


class SaleItemRequest(BaseModel):
    product_id: int
    quantity: int


class SaleCreate(BaseModel):

    items: List[SaleItemRequest]

    payment_received: float