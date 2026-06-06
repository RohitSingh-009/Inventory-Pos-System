from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from database.database import get_db
from models.user import User
from schemas.user import UserResponse

router = APIRouter(
    prefix="/employees",
    tags=["Employees"]
)

@router.get("", response_model=list[UserResponse])
def get_employees(
    db: Session = Depends(get_db)
):
    """Get all employees"""
    employees = db.query(User).filter(User.is_active == True).all()
    return employees

@router.get("/{employee_id}", response_model=UserResponse)
def get_employee(
    employee_id: int,
    db: Session = Depends(get_db)
):
    """Get a specific employee"""
    employee = db.query(User).filter(User.id == employee_id).first()
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    return employee

@router.put("/{employee_id}", response_model=UserResponse)
def update_employee(
    employee_id: int,
    name: str = None,
    email: str = None,
    role: str = None,
    db: Session = Depends(get_db)
):
    """Update employee details"""
    employee = db.query(User).filter(User.id == employee_id).first()
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    
    if name:
        employee.name = name
    if email:
        employee.email = email
    if role:
        employee.role = role
    
    db.commit()
    db.refresh(employee)
    return employee

@router.delete("/{employee_id}")
def delete_employee(
    employee_id: int,
    db: Session = Depends(get_db)
):
    """Soft delete an employee"""
    employee = db.query(User).filter(User.id == employee_id).first()
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    
    employee.is_active = False
    db.commit()
    return {"message": "Employee deactivated successfully"}
