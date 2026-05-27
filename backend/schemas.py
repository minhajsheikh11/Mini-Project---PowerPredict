from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserOut(BaseModel):
    id: int
    name: str
    email: str
    created_at: datetime
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserOut

class PredictionInput(BaseModel):
    ac_hours: float
    fan_hours: float
    heater_hours: float
    fridge_hours: float
    washing_machine_hours: float
    tv_hours: float
    ac_count:int
    fan_count:int
    heater_count:int
    fridge_count:int
    wm_count:int
    tv_count:int
    lights_count: int
    num_people: int
    season: str  # summer | winter | monsoon | spring

class PredictionOut(BaseModel):
    id: int
    ac_hours: float
    fan_hours: float
    heater_hours: float
    fridge_hours: float
    washing_machine_hours: float
    tv_hours: float
    ac_count:int
    fan_count:int
    heater_count:int
    fridge_count:int
    wm_count:int
    tv_count:int
    lights_count: int
    num_people: int
    season: str
    predicted_units: float
    predicted_bill: float
    created_at: datetime
    class Config:
        from_attributes = True
