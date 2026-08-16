from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict, Field

class ProductCreate(BaseModel):
    name: str = Field(..., min_length=1, json_schema_extra={"example": "Cloud Server Instance"})
    description: Optional[str] = Field(None, json_schema_extra={"example": "High performance server"})
    price: float = Field(..., gt=0, json_schema_extra={"example": 49.99})

class ProductResponse(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    price: float
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
