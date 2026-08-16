import sys
import logging
from sqlalchemy.orm import Session
from app.db.database import SessionLocal
from app.db.models import User, Product, Order

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def test_crud_operations():
    db: Session = SessionLocal()
    test_user_email = "temp_test_user@example.com"
    test_product_name = "Test Temporary Service"

    try:
        logger.info("--- Starting Database CRUD Verification Test ---")

        # 1. CREATE
        logger.info("[1/4] Testing CREATE...")
        # Create User
        test_user = User(email=test_user_email, hashed_password="hashed_test_pass")
        db.add(test_user)
        db.commit()
        db.refresh(test_user)
        assert test_user.id is not None, "Failed to create User ID"
        logger.info(f"  Created User (ID: {test_user.id}, Email: {test_user.email})")

        # Create Product
        test_product = Product(name=test_product_name, description="Temp test desc", price=19.99)
        db.add(test_product)
        db.commit()
        db.refresh(test_product)
        assert test_product.id is not None, "Failed to create Product ID"
        logger.info(f"  Created Product (ID: {test_product.id}, Name: {test_product.name})")

        # Create Order
        test_order = Order(user_id=test_user.id, total_amount=19.99, status="pending")
        db.add(test_order)
        db.commit()
        db.refresh(test_order)
        assert test_order.id is not None, "Failed to create Order ID"
        logger.info(f"  Created Order (ID: {test_order.id}, Amount: {test_order.total_amount})")

        # 2. READ
        logger.info("[2/4] Testing READ...")
        read_user = db.query(User).filter_by(email=test_user_email).first()
        assert read_user is not None, "Failed to query created User"
        assert len(read_user.orders) == 1, "Failed to fetch relationship orders"
        logger.info(f"  Queried User: {read_user.email} with {len(read_user.orders)} order(s)")

        read_product = db.query(Product).filter_by(name=test_product_name).first()
        assert read_product is not None, "Failed to query created Product"
        logger.info(f"  Queried Product: {read_product.name}, Price: ${read_product.price}")

        # 3. UPDATE
        logger.info("[3/4] Testing UPDATE...")
        test_user.email = "updated_temp_user@example.com"
        test_product.price = 24.99
        test_order.status = "completed"
        db.commit()

        updated_user = db.query(User).filter_by(id=test_user.id).first()
        assert updated_user.email == "updated_temp_user@example.com", "Failed to update User email"
        updated_product = db.query(Product).filter_by(id=test_product.id).first()
        assert float(updated_product.price) == 24.99, "Failed to update Product price"
        updated_order = db.query(Order).filter_by(id=test_order.id).first()
        assert updated_order.status == "completed", "Failed to update Order status"
        logger.info("  Successfully updated User, Product, and Order records")

        # 4. DELETE
        logger.info("[4/4] Testing DELETE...")
        db.delete(test_user) # Cascades to order
        db.delete(test_product)
        db.commit()

        deleted_user = db.query(User).filter_by(id=test_user.id).first()
        assert deleted_user is None, "User not deleted"
        deleted_order = db.query(Order).filter_by(id=test_order.id).first()
        assert deleted_order is None, "Order cascade delete failed"
        deleted_product = db.query(Product).filter_by(id=test_product.id).first()
        assert deleted_product is None, "Product delete failed"
        logger.info("  Successfully cleaned up temporary test records")

        logger.info("--- CRUD Verification Test Completed Successfully! ---")

    except Exception as e:
        logger.error(f"CRUD verification test FAILED: {e}")
        db.rollback()
        sys.exit(1)
    finally:
        db.close()

if __name__ == "__main__":
    test_crud_operations()
