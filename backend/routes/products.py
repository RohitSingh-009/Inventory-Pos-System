from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database.database import SessionLocal

from models.product import Product
from database.database import get_db
from schemas.product import ProductCreate


router = APIRouter(
    prefix="/products",
    tags=["Products"]
)

def generate_barcode():
    import random

    return f"P{random.randint(100000,999999)}"

@router.post("/")
def create_product(
    data: ProductCreate,
    db: Session = Depends(get_db)
):

    product = Product(
        name=data.name,
        barcode=generate_barcode(),
        category_id=data.category_id,
        buying_price=data.buying_price,
        selling_price=data.selling_price,
        stock_quantity=data.stock_quantity,
        low_stock_limit=data.low_stock_limit
    )

    db.add(product)

    db.commit()

    return {
        "message": "Product Created"
    }
    
    
@router.get("/")
def get_products(
    db: Session = Depends(get_db)
):
    return db.query(Product).all()


@router.get("/low-stock/list")
def low_stock_products(
    db: Session = Depends(get_db)
):
    return (
        db.query(Product)
        .filter(
            Product.stock_quantity
            <= Product.low_stock_limit
        )
        .all()
    )            


@router.get("/{product_id}")
def get_product(
    product_id: int,
    db: Session = Depends(get_db)
):
    return (
        db.query(Product)
        .filter(Product.id == product_id)
        .first()
    )
    
    
@router.put("/{product_id}")
def update_product(
    product_id: int,
    data: ProductCreate,
    db: Session = Depends(get_db)
):

    product = (
        db.query(Product)
        .filter(Product.id == product_id)
        .first()
    )

    product.name = data.name
    product.category_id = data.category_id

    product.buying_price = data.buying_price
    product.selling_price = data.selling_price

    product.stock_quantity = data.stock_quantity

    product.low_stock_limit = data.low_stock_limit

    db.commit()

    return {
        "message": "Product Updated"
    }
    
    
@router.get("/barcode/{barcode}")
def get_product_by_barcode(
    barcode: str,
    db: Session = Depends(get_db)
):
    product = (
        db.query(Product)
        .filter(
            Product.barcode == barcode
        )
        .first()
    )

    if not product:
        raise HTTPException(
            status_code=404,
            detail="Product Not Found"
        )

    return product