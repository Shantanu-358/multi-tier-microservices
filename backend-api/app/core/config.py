import os
from typing import List

class Settings:
    PROJECT_NAME: str = "Multi-Tier Microservices API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    SECRET_KEY: str = os.getenv("JWT_SECRET_KEY", "super-secret-jwt-key-for-local-dev-change-in-prod-12345")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "1440")) # 24 hours
    
    DATABASE_URL: str = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@database:5432/app_db")
    CORS_ORIGINS: List[str] = ["*"]

settings = Settings()
