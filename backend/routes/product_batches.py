from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import date

from database.database import get_db

from models.product_batch import ProductBatch
from models.product import Product
from schemas.product_batch import ProductBatchCreate

router = APIRouter(
    prefix="/batches",
    tags=["Batches"]
)


@router.post("/")
def create_batch(
    data: ProductBatchCreate,
    db: Session = Depends(get_db)
):
    batch = ProductBatch(
        product_id=data.product_id,
        batch_no=data.batch_no,
        quantity=data.quantity,
        manufacturing_date=data.manufacturing_date,
        expiry_date=data.expiry_date
    )

    db.add(batch)

    product = (
        db.query(Product)
        .filter(Product.id == data.product_id)
        .first()
    )

    if product:
        product.stock_quantity += data.quantity

    db.commit()

    return {"message": "Batch Created"}


@router.get("/")
def get_batches(
    db: Session = Depends(get_db)
):
    return db.query(ProductBatch).all()


@router.get("/product/{product_id}")
def get_product_batches(
    product_id: int,
    db: Session = Depends(get_db)
):
    return (
        db.query(ProductBatch)
        .filter(ProductBatch.product_id == product_id)
        .all()
    )


@router.get("/expiry")
def expiry_batches(
    db: Session = Depends(get_db)
):
    batches = db.query(ProductBatch).all()

    today = date.today()
    earliest_by_product = {}

    for batch in batches:
        if batch.disposed:
            continue

        existing = earliest_by_product.get(batch.product_id)
        if not existing or batch.expiry_date < existing.expiry_date:
            earliest_by_product[batch.product_id] = batch

    result = []

    for batch in batches:
        product = (
            db.query(Product)
            .filter(Product.id == batch.product_id)
            .first()
        )

        if not product:
            continue

        days_remaining = (batch.expiry_date - today).days

        if batch.disposed:
            status = "disposed"
        elif days_remaining < 0:
            status = "expired"
        elif days_remaining <= 3:
            status = "critical"
        elif days_remaining <= 7:
            status = "expiring"
        else:
            status = "fresh"

        result.append({
            "id": batch.id,
            "product_name": product.name,
            "product_id": batch.product_id,
            "batch_no": batch.batch_no,
            "quantity": batch.quantity,
            "expiry_date": batch.expiry_date,
            "days_remaining": days_remaining,
            "status": status,
            "disposed": batch.disposed,
            "front_shelf": batch.front_shelf,
            "is_fifo": (
                not batch.disposed
                and earliest_by_product.get(batch.product_id)
                and earliest_by_product[batch.product_id].id == batch.id
            ),
            "can_bill": not batch.disposed and days_remaining >= 0
        })

    return result


@router.put("/dispose/{batch_id}")
def dispose_batch(
    batch_id: int,
    db: Session = Depends(get_db)
):
    batch = (
        db.query(ProductBatch)
        .filter(ProductBatch.id == batch_id)
        .first()
    )

    if not batch:
        raise HTTPException(status_code=404, detail="Batch not found")

    if batch.disposed:
        return {"message": "Batch already disposed"}

    product = (
        db.query(Product)
        .filter(Product.id == batch.product_id)
        .first()
    )

    if product:
        product.stock_quantity = max(product.stock_quantity - batch.quantity, 0)

    batch.disposed = True
    db.commit()

    return {"message": "Batch Disposed"}


@router.put("/front-shelf/{batch_id}")
def front_shelf_batch(
    batch_id: int,
    db: Session = Depends(get_db)
):
    batch = (
        db.query(ProductBatch)
        .filter(ProductBatch.id == batch_id)
        .first()
    )

    if not batch:
        raise HTTPException(status_code=404, detail="Batch not found")

    if batch.disposed:
        raise HTTPException(
            status_code=400,
            detail="Disposed batches cannot be moved to the front shelf"
        )

    batch.front_shelf = True
    db.commit()

    return {"message": "Batch moved to front shelf"}
