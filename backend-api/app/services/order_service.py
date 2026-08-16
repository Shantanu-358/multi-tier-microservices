from typing import List
from sqlalchemy.orm import Session

from app.db.models import Order
from app.schemas.order import OrderCreate

def get_user_orders(db: Session, user_id: int) -> List[Order]:
    return db.query(Order).filter(Order.user_id == user_id).order_by(Order.id.desc()).all()

def create_order(db: Session, user_id: int, order_in: OrderCreate) -> Order:
    order = Order(
        user_id=user_id,
        total_amount=order_in.total_amount,
        status=order_in.status or "pending"
    )
    db.add(order)
    db.commit()
    db.refresh(order)
    return order
