from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from app.db.models import User
from app.schemas.auth import UserCreate, UserLogin
from app.core.security import get_password_hash, verify_password, create_access_token

def register_user(db: Session, user_in: UserCreate) -> tuple[User, str]:
    existing_user = db.query(User).filter(User.email == user_in.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A user with this email address already exists."
        )
    
    hashed_pass = get_password_hash(user_in.password)
    user = User(
        email=user_in.email,
        hashed_password=hashed_pass
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    token = create_access_token(subject=user.id)
    return user, token

def authenticate_user(db: Session, user_in: UserLogin) -> tuple[User, str]:
    user = db.query(User).filter(User.email == user_in.email).first()
    if not user or not verify_password(user_in.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    token = create_access_token(subject=user.id)
    return user, token
