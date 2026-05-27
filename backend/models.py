from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    predictions = relationship("Prediction", back_populates="owner")

class Prediction(Base):
    __tablename__ = "predictions"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    ac_hours = Column(Float)
    ac_count =Column(Integer)
    fan_hours = Column(Float)
    fan_count = Column(Integer)
    heater_hours = Column(Float)
    heater_count = Column(Integer)
    fridge_hours = Column(Float)
    fridge_count = Column(Integer)
    washing_machine_hours = Column(Float)
    wm_count = Column(Integer)
    tv_hours = Column(Float)
    tv_count = Column(Integer)
    lights_count = Column(Integer)
    num_people = Column(Integer)
    season = Column(String)
    predicted_units = Column(Float)
    predicted_bill = Column(Float)
    created_at = Column(DateTime, default=datetime.utcnow)
    owner = relationship("User", back_populates="predictions")
