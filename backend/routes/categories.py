from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database.database import SessionLocal
from database.database import get_db

from models.category import Category

from schemas.category import CategoryCreate

router = APIRouter(
    prefix="/categories",
    tags=["Categories"]
)

def get_db():
    db = SessionLocal()

    try:
        yield db

    finally:
        db.close()
        
@router.post("/")
def create_category(
    data: CategoryCreate,
    db: Session = Depends(get_db)
):
    category = Category(
        name=data.name
    )

    db.add(category)
    db.commit()

    return {
        "message": "Category Created"
    }        
    
    
@router.get("/")
def get_categories(
    db: Session = Depends(get_db)
):
    return db.query(Category).all()    