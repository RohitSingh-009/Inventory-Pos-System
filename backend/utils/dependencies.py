from fastapi import Depends
from fastapi import HTTPException
from fastapi.security import HTTPBearer
from sqlalchemy.orm import Session

from database.database import SessionLocal

from models.user import User

from utils.jwt_handler import verify_token

security = HTTPBearer()

def get_db():
    db = SessionLocal()

    try:
        yield db

    finally:
        db.close()
        
def get_current_user(
    credentials=Depends(security),
    db: Session = Depends(get_db)
):

    token = credentials.credentials

    payload = verify_token(token)

    if not payload:

        raise HTTPException(
            status_code=401,
            detail="Invalid Token"
        )

    user = (
        db.query(User)
        .filter(
            User.id == payload["user_id"]
        )
        .first()
    )

    if not user:

        raise HTTPException(
            status_code=401,
            detail="User Not Found"
        )

    return user


def admin_required(
    current_user=Depends(get_current_user)
):

    if current_user.role != "admin":

        raise HTTPException(
            status_code=403,
            detail="Admin Access Required"
        )

    return current_user        