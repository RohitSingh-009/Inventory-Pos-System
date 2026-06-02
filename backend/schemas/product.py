from pydantic import BaseModel


class ProductCreate(BaseModel):
    name: str
    category_id: int

    buying_price: float
    selling_price: float

    stock_quantity: int

    low_stock_limit: int