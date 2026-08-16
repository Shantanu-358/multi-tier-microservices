from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.schemas.auth import UserCreate, UserLogin, Token, UserResponse
from app.services.auth_service import register_user, authenticate_user

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=Token, status_code=status.HTTP_201_CREATED, summary="Register a new user")
def register(user_in: UserCreate, db: Session = Depends(get_db)):
    user, token = register_user(db, user_in)
    return Token(
        access_token=token,
        token_type="bearer",
        user=UserResponse.model_validate(user)
    )

@router.post("/login", response_model=Token, summary="Authenticate user & obtain JWT token")
def login(user_in: UserLogin, db: Session = Depends(get_db)):
    user, token = authenticate_user(db, user_in)
    return Token(
        access_token=token,
        token_type="bearer",
        user=UserResponse.model_validate(user)
    )
