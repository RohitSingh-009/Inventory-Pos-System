from fastapi import APIRouter, Depends, HTTPException

from sqlalchemy.orm import Session

from database.database import SessionLocal
from database.database import get_db

from models.sale import Sale
from models.sale_item import SaleItem
from models.product import Product

from schemas.sale import SaleCreate


router = APIRouter(
    prefix="/sales",
    tags=["Sales"]
)

def get_db():
    db = SessionLocal()

    try:
        yield db

    finally:
        db.close()
        
        
def generate_invoice(db):
    count = db.query(Sale).count() + 1

    return f"INV{count:04d}"

@router.post("/")
def create_sale(
    data: SaleCreate,
    db: Session = Depends(get_db)
):
    total_amount = 0

    sale_items_data = []

    for item in data.items:

        product = (
            db.query(Product)
            .filter(Product.id == item.product_id)
            .first()
        )

        if not product:
            raise HTTPException(
                status_code=404,
                detail="Product Not Found"
            )

        if product.stock_quantity < item.quantity:
            raise HTTPException(
                status_code=400,
                detail=f"Insufficient Stock for {product.name}"
            )

        subtotal = (
            product.selling_price
            * item.quantity
        )

        total_amount += subtotal

        sale_items_data.append(
            {
                "product": product,
                "quantity": item.quantity,
                "price": product.selling_price,
                "subtotal": subtotal
            }
        )

    if data.payment_received < total_amount:
        raise HTTPException(
            status_code=400,
            detail="Insufficient Payment"
        )

    change_returned = (
        data.payment_received
        - total_amount
    )

    sale = Sale(
        invoice_number=generate_invoice(db),
        total_amount=total_amount,
        payment_received=data.payment_received,
        change_returned=change_returned,
        created_by=1
    )

    db.add(sale)

    db.commit()

    db.refresh(sale)

    for item in sale_items_data:

        sale_item = SaleItem(
            sale_id=sale.id,
            product_id=item["product"].id,
            quantity=item["quantity"],
            price=item["price"],
            subtotal=item["subtotal"]
        )

        db.add(sale_item)

        item["product"].stock_quantity -= item["quantity"]

    db.commit()

    return {
        "sale_id": sale.id,
        "invoice_number": sale.invoice_number,
        "total_amount": total_amount,
        "payment_received": data.payment_received,
        "change_returned": change_returned
    }
    
    
@router.get("/")
def get_sales(
    db: Session = Depends(get_db)
):
    return db.query(Sale).all()


@router.get("/{sale_id}")
def get_sale(
    sale_id: int,
    db: Session = Depends(get_db)
):
    sale = (
        db.query(Sale)
        .filter(Sale.id == sale_id)
        .first()
    )

    if not sale:
        raise HTTPException(
            status_code=404,
            detail="Sale Not Found"
        )

    items = (
        db.query(SaleItem)
        .filter(
            SaleItem.sale_id == sale_id
        )
        .all()
    )

    return {
        "sale": sale,
        "items": items
    }            