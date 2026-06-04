from pydantic import BaseModel, Field, field_validator


class ProductCreate(BaseModel):
    name: str
    category_id: int

    buying_price: float = Field(..., ge=0)
    selling_price: float = Field(..., ge=0)

    stock_quantity: int = Field(..., ge=0)
    low_stock_limit: int = Field(..., ge=0)

    @field_validator("name")
    @classmethod
    def validate_name(cls, value):
        if len(value.strip()) < 3:
            raise ValueError("Product name must be at least 3 characters")
        return value