from datetime import datetime
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import func, or_
from sqlalchemy.orm import Session

from database.database import get_db
from models.user import User
from models.sale import Sale
from models.staff_activity import StaffActivity
from models.staff_sales_summary import StaffSalesSummary
from schemas.staff import (
    StaffActivitySummary,
    StaffActivityItem,
    StaffCreate,
    StaffPerformanceItem,
    StaffResponse,
    StaffSalesResponse,
    StaffUpdate,
    SaleDetail,
)
from utils.dependencies import admin_required, get_current_user
from utils.security import hash_password

router = APIRouter(
    prefix="/staff",
    tags=["Staff"],
)


@router.get("/", response_model=List[StaffResponse])
def get_staff_list(
    search: Optional[str] = Query(None, description="Search by name, email or phone number"),
    role: Optional[str] = Query(None, description="Filter by role"),
    status: Optional[str] = Query(None, description="Filter by status: active or inactive"),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    query = db.query(User)

    if search:
        pattern = f"%{search}%"
        query = query.filter(
            or_(
                User.name.ilike(pattern),
                User.email.ilike(pattern),
                User.phone_number.ilike(pattern),
            )
        )

    if role:
        query = query.filter(User.role == role)

    if status:
        if status.lower() == "active":
            query = query.filter(User.is_active == True)
        elif status.lower() == "inactive":
            query = query.filter(User.is_active == False)

    return query.order_by(User.id.desc()).all()


@router.post("/", response_model=StaffResponse)
def create_staff(
    data: StaffCreate,
    db: Session = Depends(get_db),
    current_user=Depends(admin_required),
):
    existing = db.query(User).filter(User.email == data.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Staff with this email already exists")

    staff = User(
        name=data.name,
        email=data.email,
        password=hash_password(data.password),
        role=data.role,
        is_active=data.is_active,
        phone_number=data.phone_number,
        join_date=data.join_date or datetime.utcnow(),
    )

    db.add(staff)
    db.commit()
    db.refresh(staff)

    return staff


@router.put("/{staff_id}", response_model=StaffResponse)
def update_staff(
    staff_id: int,
    data: StaffUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(admin_required),
):
    staff = db.query(User).filter(User.id == staff_id).first()
    if not staff:
        raise HTTPException(status_code=404, detail="Staff member not found")

    if data.email and data.email != staff.email:
        duplicate = db.query(User).filter(User.email == data.email, User.id != staff_id).first()
        if duplicate:
            raise HTTPException(status_code=400, detail="Email already in use")

    for field, value in data.dict(exclude_unset=True).items():
        if field == "password":
            setattr(staff, field, hash_password(value))
        else:
            setattr(staff, field, value)

    db.commit()
    db.refresh(staff)

    return staff


@router.delete("/{staff_id}")
def delete_staff(
    staff_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(admin_required),
):
    staff = db.query(User).filter(User.id == staff_id).first()
    if not staff:
        raise HTTPException(status_code=404, detail="Staff member not found")

    db.delete(staff)
    db.commit()

    return {"detail": "Staff member deleted successfully"}


@router.get("/performance", response_model=List[StaffPerformanceItem])
def get_staff_performance(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    performance_data = (
        db.query(
            User.id.label("staff_id"),
            User.name.label("staff_name"),
            func.count(Sale.id).label("total_orders"),
            func.coalesce(func.sum(Sale.total_amount), 0.0).label("total_revenue"),
            func.coalesce(func.avg(Sale.total_amount), 0.0).label("average_bill_value"),
            func.max(Sale.created_at).label("last_sale_time"),
        )
        .outerjoin(Sale, Sale.created_by == User.id)
        .group_by(User.id)
        .order_by(User.name)
        .all()
    )

    return performance_data


@router.get("/{staff_id}/sales", response_model=StaffSalesResponse)
def get_staff_sales(
    staff_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    staff = db.query(User).filter(User.id == staff_id).first()
    if not staff:
        raise HTTPException(status_code=404, detail="Staff member not found")

    sales_query = db.query(Sale).filter(Sale.created_by == staff_id).order_by(Sale.created_at.desc())
    sales = sales_query.all()

    total_orders = sales_query.count()
    total_revenue = db.query(func.coalesce(func.sum(Sale.total_amount), 0.0)).filter(Sale.created_by == staff_id).scalar() or 0.0
    average_bill_value = db.query(func.coalesce(func.avg(Sale.total_amount), 0.0)).filter(Sale.created_by == staff_id).scalar() or 0.0
    last_sale_time = db.query(func.max(Sale.created_at)).filter(Sale.created_by == staff_id).scalar()

    return StaffSalesResponse(
        staff_id=staff.id,
        staff_name=staff.name,
        total_orders=total_orders,
        total_revenue=total_revenue,
        average_bill_value=average_bill_value,
        last_sale_time=last_sale_time,
        sales=[SaleDetail.from_orm(sale) for sale in sales],
    )


@router.get("/{staff_id}/activity", response_model=StaffActivitySummary)
def get_staff_activity(
    staff_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    staff = db.query(User).filter(User.id == staff_id).first()
    if not staff:
        raise HTTPException(status_code=404, detail="Staff member not found")

    actions = (
        db.query(StaffActivity)
        .filter(StaffActivity.staff_id == staff_id)
        .order_by(StaffActivity.created_at.desc())
        .all()
    )

    total_logins = (
        db.query(func.count(StaffActivity.id))
        .filter(
            StaffActivity.staff_id == staff_id,
            StaffActivity.action_type == "login",
        )
        .scalar()
    )
    total_logouts = (
        db.query(func.count(StaffActivity.id))
        .filter(
            StaffActivity.staff_id == staff_id,
            StaffActivity.action_type == "logout",
        )
        .scalar()
    )
    total_bills = (
        db.query(func.count(StaffActivity.id))
        .filter(
            StaffActivity.staff_id == staff_id,
            StaffActivity.action_type == "bill_created",
        )
        .scalar()
    )
    products_sold = (
        db.query(func.count(StaffActivity.id))
        .filter(
            StaffActivity.staff_id == staff_id,
            StaffActivity.action_type == "products_sold",
        )
        .scalar()
    )

    return StaffActivitySummary(
        staff_id=staff.id,
        staff_name=staff.name,
        total_logins=total_logins or 0,
        total_logouts=total_logouts or 0,
        total_bills=total_bills or 0,
        products_sold=products_sold or 0,
        actions=[StaffActivityItem.from_orm(item) for item in actions],
    )
