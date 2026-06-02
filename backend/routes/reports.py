from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import date

from database.database import SessionLocal
from database.database import get_db

from models.sale import Sale
from models.sale_item import SaleItem
from models.product import Product


router = APIRouter(
    prefix="/reports",
    tags=["Reports"]
)

@router.get("/daily")
def daily_report(
    db: Session = Depends(get_db)
):

    today = date.today()

    sales = db.query(Sale).all()

    today_sales = [
        sale
        for sale in sales
        if sale.created_at.date() == today
    ]

    revenue = sum(
        sale.total_amount
        for sale in today_sales
    )

    return {
        "sales_count": len(today_sales),
        "revenue": revenue
    }
    
    
@router.get("/monthly")
def monthly_report(
    db: Session = Depends(get_db)
):

    today = date.today()

    sales = db.query(Sale).all()

    monthly_sales = [
        sale
        for sale in sales
        if (
            sale.created_at.month == today.month
            and
            sale.created_at.year == today.year
        )
    ]

    revenue = sum(
        sale.total_amount
        for sale in monthly_sales
    )

    return {
        "sales_count": len(monthly_sales),
        "revenue": revenue
    }

@router.get("/top-products")
def top_products(
    db: Session = Depends(get_db)
):

    sale_items = (
        db.query(SaleItem)
        .all()
    )

    product_sales = {}

    for item in sale_items:

        if item.product_id not in product_sales:

            product_sales[item.product_id] = 0

        product_sales[item.product_id] += item.quantity

    result = []

    for product_id, quantity in product_sales.items():

        product = (
            db.query(Product)
            .filter(
                Product.id == product_id
            )
            .first()
        )

        result.append(
            {
                "product_name": product.name,
                "quantity_sold": quantity
            }
        )

    result.sort(
        key=lambda x: x["quantity_sold"],
        reverse=True
    )

    return result[:10]        