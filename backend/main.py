from fastapi import FastAPI
from sqlalchemy import inspect, text

from routes.auth import router as auth_router

from database.database import engine
from database.base import Base

from models.user import User

from models.category import Category
from models.product import Product


from models.sale import Sale
from models.sale_item import SaleItem

from routes.categories import router as category_router
from routes.products import router as product_router

from routes.sales import router as sales_router


from routes.dashboard import router as dashboard_router
from routes.reports import router as reports_router

from fastapi.middleware.cors import CORSMiddleware
from models.product_batch import ProductBatch

from routes.product_batches import (
    router as batch_router
)

Base.metadata.create_all(bind=engine)


def ensure_batch_columns():
    inspector = inspect(engine)
    if "product_batches" not in inspector.get_table_names():
        return

    existing_columns = {col["name"] for col in inspector.get_columns("product_batches")}
    with engine.begin() as conn:
        if "front_shelf" not in existing_columns:
            conn.execute(text("ALTER TABLE product_batches ADD COLUMN front_shelf BOOLEAN DEFAULT FALSE"))
        if "disposed" not in existing_columns:
            conn.execute(text("ALTER TABLE product_batches ADD COLUMN disposed BOOLEAN DEFAULT FALSE"))


ensure_batch_columns()

app = FastAPI(
    title="Grocery POS API"
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)  
app.include_router(auth_router)
app.include_router(category_router)
app.include_router(product_router)
app.include_router(sales_router)
app.include_router(dashboard_router)
app.include_router(reports_router)
app.include_router(
    batch_router
)

@app.get("/")
def root():
    return {
        "message": "Backend Running"
    }
    
  