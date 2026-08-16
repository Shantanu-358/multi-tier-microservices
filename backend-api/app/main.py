from contextlib import asynccontextmanager
from fastapi import FastAPI, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from sqlalchemy import text

from app.core.config import settings
from app.core.logging import setup_logging, logger
from app.db.database import get_db, engine, Base
from app.db.models import SystemStatus, User, Product, Order
from app.api.v1.router import api_v1_router

# Setup logging
setup_logging()

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Try creating tables on startup safely
    try:
        Base.metadata.create_all(bind=engine)
        logger.info("Database tables verified/created successfully.")
    except Exception as e:
        logger.warning(f"Could not auto-create database tables on startup: {e}")
    yield

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Production-ready REST API backend service with JWT authentication and modular service architecture",
    version=settings.VERSION,
    lifespan=lifespan
)

# CORS Setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global Exception Handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled Exception on {request.url.path}: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"detail": "An unexpected internal server error occurred."}
    )

# Include API v1 routes (/api/v1/health, /api/v1/auth/*, /api/v1/products, /api/v1/orders)
app.include_router(api_v1_router, prefix=settings.API_V1_STR)

# Top-level /health endpoint
@app.get("/health", tags=["Health"])
@app.get("/api/health", tags=["Health"])
def health_check(db: Session = Depends(get_db)):
    db_status = "disconnected"
    try:
        status_entry = db.query(SystemStatus).filter_by(service_name="database").first()
        if status_entry:
            db_status = f"connected ({status_entry.status})"
        else:
            db.execute(text("SELECT 1"))
            db_status = "connected"
    except Exception as e:
        db_status = f"error: {str(e)}"

    return {
        "service": "backend-api",
        "status": "healthy",
        "database": db_status
    }

@app.get("/api/info", tags=["Info"])
def get_info():
    return {
        "app_name": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "architecture": ["frontend (Vite React)", "backend-api (FastAPI)", "gateway (Nginx)", "database (PostgreSQL)"],
        "status": "running"
    }

# Legacy endpoints mapping to database query for backward compatibility
@app.get("/api/users", tags=["Legacy"])
def get_users_legacy(db: Session = Depends(get_db)):
    users = db.query(User).all()
    return [{"id": u.id, "email": u.email, "created_at": u.created_at.isoformat() if u.created_at else None} for u in users]

@app.get("/api/products", tags=["Legacy"])
def get_products_legacy(db: Session = Depends(get_db)):
    products = db.query(Product).all()
    return [{"id": p.id, "name": p.name, "description": p.description, "price": float(p.price), "created_at": p.created_at.isoformat() if p.created_at else None} for p in products]

@app.get("/api/orders", tags=["Legacy"])
def get_orders_legacy(db: Session = Depends(get_db)):
    orders = db.query(Order).all()
    return [{"id": o.id, "user_id": o.user_id, "user_email": o.user.email if o.user else None, "total_amount": float(o.total_amount), "status": o.status, "created_at": o.created_at.isoformat() if o.created_at else None} for o in orders]
