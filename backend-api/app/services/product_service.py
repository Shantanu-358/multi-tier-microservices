from typing import List
from sqlalchemy.orm import Session

from app.db.models import Product
from app.schemas.product import ProductCreate

def get_all_products(db: Session) -> List[Product]:
    return db.query(Product).order_by(Product.id.asc()).all()

def create_product(db: Session, product_in: ProductCreate) -> Product:
    product = Product(
        name=product_in.name,
        description=product_in.description,
        price=product_in.price
    )
    db.add(product)
    db.commit()
    db.refresh(product)
    return product
