from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict, Field

class UserCreate(BaseModel):
    email: str = Field(..., json_schema_extra={"example": "user@example.com"})
    password: str = Field(..., min_length=6, json_schema_extra={"example": "strongpassword123"})

class UserLogin(BaseModel):
    email: str = Field(..., json_schema_extra={"example": "user@example.com"})
    password: str = Field(..., json_schema_extra={"example": "strongpassword123"})

class UserResponse(BaseModel):
    id: int
    email: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse
