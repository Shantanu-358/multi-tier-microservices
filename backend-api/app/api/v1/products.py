from typing import List
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.db.models import User
from app.schemas.product import ProductCreate, ProductResponse
from app.services.product_service import get_all_products, create_product
from app.middleware.auth_middleware import get_current_user

router = APIRouter(prefix="/products", tags=["Products"])

@router.get("", response_model=List[ProductResponse], summary="List all products (Public)")
def list_products(db: Session = Depends(get_db)):
    products = get_all_products(db)
    return [ProductResponse.model_validate(p) for p in products]

@router.post("", response_model=ProductResponse, status_code=status.HTTP_201_CREATED, summary="Create a product (Protected)")
def add_product(
    product_in: ProductCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    product = create_product(db, product_in)
    return ProductResponse.model_validate(product)
