"""
Train a Random Forest regression model to predict monthly electricity consumption.
Run: python train_model.py
"""
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import mean_absolute_error, r2_score
import pickle
import os

np.random.seed(42)
N = 5000

season_map = {"summer": 1.35, "winter": 1.20, "monsoon": 0.90, "spring": 1.0}

def generate_dataset(n):
    seasons = np.random.choice(list(season_map.keys()), n)
    season_factors = np.array([season_map[s] for s in seasons])

    ac_hours = np.where(
        seasons == "summer", np.random.uniform(4, 12, n),
        np.where(seasons == "winter", np.random.uniform(0, 1, n),
        np.random.uniform(0, 4, n))
    )
    fan_hours = np.random.uniform(2, 16, n)
    heater_hours = np.where(
        seasons == "winter", np.random.uniform(2, 8, n),
        np.random.uniform(0, 1, n)
    )
    fridge_hours = np.full(n, 24.0)  # Always on
    washing_machine_hours = np.random.uniform(0.5, 2.5, n)
    tv_hours = np.random.uniform(2, 8, n)
    lights_count = np.random.randint(3, 15, n)
    num_people = np.random.randint(1, 7, n)

    # Appliance wattage (kW)
    AC_KW = 1.5; FAN_KW = 0.075; HEATER_KW = 1.2
    FRIDGE_KW = 0.15; WASH_KW = 0.5; TV_KW = 0.1; LIGHT_KW = 0.01

    daily_kwh = (
        ac_hours * AC_KW +
        fan_hours * FAN_KW * num_people * 0.5 +
        heater_hours * HEATER_KW +
        fridge_hours * FRIDGE_KW +
        washing_machine_hours * WASH_KW +
        tv_hours * TV_KW +
        lights_count * LIGHT_KW * 6 +
        num_people * 0.3  # misc usage per person
    ) * season_factors

    monthly_units = daily_kwh * 30 + np.random.normal(0, 5, n)
    monthly_units = np.clip(monthly_units, 20, 2000)

    le = LabelEncoder()
    season_encoded = le.fit_transform(seasons)

    df = pd.DataFrame({
        "ac_hours": ac_hours,
        "fan_hours": fan_hours,
        "heater_hours": heater_hours,
        "fridge_hours": fridge_hours,
        "washing_machine_hours": washing_machine_hours,
        "tv_hours": tv_hours,
        "lights_count": lights_count,
        "num_people": num_people,
        "season_encoded": season_encoded,
        "monthly_units": monthly_units
    })
    return df, le

print("📊 Generating realistic electricity dataset...")
df, label_encoder = generate_dataset(N)

X = df.drop("monthly_units", axis=1)
y = df["monthly_units"]

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

print("🌲 Training Random Forest model...")
model = RandomForestRegressor(
    n_estimators=200,
    max_depth=12,
    min_samples_split=5,
    random_state=42,
    n_jobs=-1
)
model.fit(X_train, y_train)

y_pred = model.predict(X_test)
mae = mean_absolute_error(y_test, y_pred)
r2 = r2_score(y_test, y_pred)
print(f"✅ Model trained! MAE: {mae:.2f} units | R²: {r2:.4f}")

os.makedirs("ml", exist_ok=True)
with open("ml/model.pkl", "wb") as f:
    pickle.dump({"model": model, "label_encoder": label_encoder}, f)

print("💾 Model saved to ml/model.pkl")
