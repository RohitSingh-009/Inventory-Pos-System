from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, EmailStr


class StaffBase(BaseModel):
    name: str
    email: EmailStr
    phone_number: Optional[str] = None
    role: str
    is_active: bool = True
    join_date: Optional[datetime] = None


class StaffCreate(StaffBase):
    password: str


class StaffUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone_number: Optional[str] = None
    role: Optional[str] = None
    is_active: Optional[bool] = None
    join_date: Optional[datetime] = None
    password: Optional[str] = None


class StaffResponse(StaffBase):
    id: int
    created_at: datetime

    class Config:
        orm_mode = True


class StaffPerformanceItem(BaseModel):
    staff_id: int
    staff_name: str
    total_orders: int
    total_revenue: float
    average_bill_value: float
    last_sale_time: Optional[datetime] = None

    class Config:
        orm_mode = True


class SaleDetail(BaseModel):
    id: int
    invoice_number: str
    total_amount: float
    payment_received: float
    change_returned: float
    created_at: datetime

    class Config:
        orm_mode = True


class StaffSalesResponse(BaseModel):
    staff_id: int
    staff_name: str
    total_orders: int
    total_revenue: float
    average_bill_value: float
    last_sale_time: Optional[datetime] = None
    sales: List[SaleDetail] = []

    class Config:
        orm_mode = True


class StaffActivityItem(BaseModel):
    id: int
    action: str
    action_type: str
    details: Optional[str]
    created_at: datetime

    class Config:
        orm_mode = True


class StaffActivitySummary(BaseModel):
    staff_id: int
    staff_name: str
    total_logins: int
    total_logouts: int
    total_bills: int
    products_sold: int
    actions: List[StaffActivityItem] = []

    class Config:
        orm_mode = True
