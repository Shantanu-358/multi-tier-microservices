from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict, Field

class OrderCreate(BaseModel):
    total_amount: float = Field(..., gt=0, json_schema_extra={"example": 129.98})
    status: Optional[str] = Field("pending", json_schema_extra={"example": "pending"})

class OrderResponse(BaseModel):
    id: int
    user_id: int
    total_amount: float
    status: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
