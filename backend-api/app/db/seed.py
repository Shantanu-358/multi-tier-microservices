import sys
import logging
from sqlalchemy.orm import Session
from app.db.database import engine, SessionLocal, Base
from app.db.models import User, Product, Order, SystemStatus
from app.core.security import get_password_hash

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Valid bcrypt hash for password123
DEMO_PASSWORD_HASH = "$2b$12$XAumlkoI0HwyLyP2WaZ9xextXrk5Ql33xDzYIl2zvNJ4hN1uI5H2C"

def seed_database(db: Session) -> None:
    # 1. System Status
    existing_status = db.query(SystemStatus).filter_by(service_name="database").first()
    if not existing_status:
        db.add_all([
            SystemStatus(service_name="database", status="healthy"),
            SystemStatus(service_name="backend-api", status="initialized"),
            SystemStatus(service_name="frontend", status="initialized"),
        ])
        logger.info("Seeded system status entries.")

    # 2. Users
    alice = db.query(User).filter_by(email="alice@example.com").first()
    if not alice:
        users = [
            User(email="alice@example.com", hashed_password=DEMO_PASSWORD_HASH),
            User(email="bob@example.com", hashed_password=DEMO_PASSWORD_HASH),
            User(email="charlie@example.com", hashed_password=DEMO_PASSWORD_HASH),
        ]
        db.add_all(users)
        db.flush()
        logger.info(f"Seeded {len(users)} users.")
    else:
        # Update existing user passwords to valid bcrypt hash
        for u in db.query(User).all():
            u.hashed_password = DEMO_PASSWORD_HASH
        logger.info("Updated existing user password hashes to valid bcrypt hash.")

    # 3. Products
    if db.query(Product).count() == 0:
        products = [
            Product(name="Cloud Server Instance", description="High performance virtual server with 4 vCPUs and 16GB RAM", price=49.99),
            Product(name="Managed PostgreSQL Database", description="Fully managed, auto-scaling relational database service", price=79.99),
            Product(name="API Gateway Pro", description="Enterprise API gateway with rate limiting and traffic analytics", price=29.99),
        ]
        db.add_all(products)
        db.flush()
        logger.info(f"Seeded {len(products)} products.")
    else:
        logger.info("Products table already populated.")

    # 4. Orders
    if db.query(Order).count() == 0:
        first_user = db.query(User).first()
        if first_user:
            orders = [
                Order(user_id=first_user.id, total_amount=129.98, status="completed"),
                Order(user_id=first_user.id, total_amount=49.99, status="pending"),
            ]
            db.add_all(orders)
            logger.info(f"Seeded {len(orders)} orders for user {first_user.email}.")

    db.commit()
    logger.info("Database seeding completed successfully.")

def main():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        seed_database(db)
    except Exception as e:
        logger.error(f"Error seeding database: {e}")
        db.rollback()
        sys.exit(1)
    finally:
        db.close()

if __name__ == "__main__":
    main()
