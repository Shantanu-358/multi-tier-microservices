from typing import List
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.db.models import User
from app.schemas.order import OrderCreate, OrderResponse
from app.services.order_service import get_user_orders, create_order
from app.middleware.auth_middleware import get_current_user

router = APIRouter(prefix="/orders", tags=["Orders"])

@router.get("", response_model=List[OrderResponse], summary="Get authenticated user orders (Protected)")
def list_orders(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    orders = get_user_orders(db, current_user.id)
    return [OrderResponse.model_validate(o) for o in orders]

@router.post("", response_model=OrderResponse, status_code=status.HTTP_201_CREATED, summary="Create a new order (Protected)")
def add_order(
    order_in: OrderCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    order = create_order(db, current_user.id, order_in)
    return OrderResponse.model_validate(order)
