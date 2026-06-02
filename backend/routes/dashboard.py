from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import date
from database.database import get_db
from database.database import SessionLocal

from models.product import Product
from models.sale import Sale

router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"]
)


@router.get("/")
def dashboard_stats(
    db: Session = Depends(get_db)
):

    total_products = (
        db.query(Product)
        .count()
    )

    total_sales = (
        db.query(Sale)
        .count()
    )

    today = date.today()

    sales = db.query(Sale).all()

    today_revenue = sum(
        sale.total_amount
        for sale in sales
        if sale.created_at.date() == today
    )

    low_stock_products = (
        db.query(Product)
        .filter(
            Product.stock_quantity
            <= Product.low_stock_limit
        )
        .count()
    )

    return {
        "total_products": total_products,
        "total_sales": total_sales,
        "today_revenue": today_revenue,
        "low_stock_products": low_stock_products
    }