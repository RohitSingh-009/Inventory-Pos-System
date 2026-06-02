from fastapi import FastAPI

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


Base.metadata.create_all(bind=engine)



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

@app.get("/")
def root():
    return {
        "message": "Backend Running"
    }
    
  