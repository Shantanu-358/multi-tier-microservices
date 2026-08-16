from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text

from app.db.database import get_db
from app.db.models import SystemStatus

router = APIRouter(tags=["Health"])

@router.get("/health", summary="Service & Database Health Status")
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
