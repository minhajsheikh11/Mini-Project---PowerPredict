from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from auth import get_current_user
import models, schemas
import pickle
import numpy as np
import os

router = APIRouter(prefix="/api", tags=["Predictions"])

# Load model once at startup
MODEL_PATH = os.path.join(os.path.dirname(__file__), "..", "ml", "model.pkl")
_model_cache = None

def get_model():
    global _model_cache
    if _model_cache is None:
        with open(MODEL_PATH, "rb") as f:
            _model_cache = pickle.load(f)
    return _model_cache

# India electricity tariff tiers (₹/unit) - approximate average
def calculate_bill(units: float) -> float:
    bill = 0.0
    if units <= 100:
        bill = units * 3.50
    elif units <= 200:
        bill = 100 * 3.50 + (units - 100) * 5.00
    elif units <= 500:
        bill = 100 * 3.50 + 100 * 5.00 + (units - 200) * 6.50
    else:
        bill = 100 * 3.50 + 100 * 5.00 + 300 * 6.50 + (units - 500) * 7.50
    bill += 50  # Fixed charges
    return round(bill, 2)

@router.post("/predict", response_model=schemas.PredictionOut)
def predict(
    data: schemas.PredictionInput,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    model_data = get_model()
    model = model_data["model"]
    le = model_data["label_encoder"]

    valid_seasons = list(le.classes_)
    if data.season not in valid_seasons:
        raise HTTPException(status_code=400, detail=f"Season must be one of: {valid_seasons}")

    season_encoded = le.transform([data.season])[0]

    features = np.array([[
    data.ac_hours * getattr(data, "ac_count", 1),
    data.fan_hours * getattr(data, "fan_count", 1),
    data.heater_hours * getattr(data, "heater_count", 1),
    data.fridge_hours * getattr(data, "fridge_count", 1),
    data.washing_machine_hours * getattr(data, "wm_count", 1),
    data.tv_hours * getattr(data, "tv_count", 1),
    data.lights_count,
    data.num_people,
    season_encoded
    ]])

    predicted_units = float(model.predict(features)[0])
    predicted_units = round(max(0, predicted_units), 2)
    predicted_bill = calculate_bill(predicted_units)

    prediction = models.Prediction(
        user_id=current_user.id,
        ac_hours=data.ac_hours,
        fan_hours=data.fan_hours,
        heater_hours=data.heater_hours,
        fridge_hours=data.fridge_hours,
        washing_machine_hours=data.washing_machine_hours,
        tv_hours=data.tv_hours,
        ac_count=data.ac_count,
        fan_count=data.fan_count,
        heater_count=data.heater_count,
        fridge_count=data.fridge_count,
        wm_count=data.wm_count,
        tv_count=data.tv_count,
        lights_count=data.lights_count,
        num_people=data.num_people,
        season=data.season,
        predicted_units=predicted_units,
        predicted_bill=predicted_bill
    )
    db.add(prediction)
    db.commit()
    db.refresh(prediction)
    return prediction

@router.get("/history", response_model=list[schemas.PredictionOut])
def history(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    predictions = (
        db.query(models.Prediction)
        .filter(models.Prediction.user_id == current_user.id)
        .order_by(models.Prediction.created_at.desc())
        .limit(20)
        .all()
    )
    return predictions
