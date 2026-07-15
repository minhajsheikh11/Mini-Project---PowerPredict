# Mini-Project---PowerPredict
# ⚡ PowerPredict — Smart Electricity Bill Predictor

ML-based electricity bill prediction for Indian households. Built with FastAPI, React, and a Random Forest model trained on 5,000 realistic consumption records.

---

## 🏗️ Architecture

```
smart-electricity-predictor/
├── backend/          ← FastAPI + SQLAlchemy + JWT + ML
│   ├── main.py
│   ├── auth.py
│   ├── models.py
│   ├── schemas.py
│   ├── database.py
│   ├── routers/
│   │   ├── auth_router.py    # POST /auth/signup, /auth/login
│   │   └── predict_router.py # POST /api/predict, GET /api/history
│   └── ml/
│       ├── train_model.py    # Generate dataset + train RF model
│       └── model.pkl         # Saved model (auto-generated)
│
└── frontend/         ← React + Vite + Tailwind CSS
    └── src/
        ├── api/axios.js         # Axios + JWT interceptors
        ├── context/AuthContext  # Auth state + JWT storage
        ├── pages/               # Landing, Login, Signup, Dashboard
        └── components/          # Navbar, Form, Charts, ProtectedRoute
```

**Data flow:**
```
React UI → Axios (+ Bearer token) → FastAPI → ML Model → SQLite → Response
```

---

## 🚀 Setup & Run

### Prerequisites
- Python 3.10+
- Node.js 18+

---

### 1. Backend

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate       # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Train the ML model (only needed once)
python ml/train_model.py

# Start API server
uvicorn main:app --reload --port 8000
```

API runs at: **http://localhost:8000**
Swagger docs: **http://localhost:8000/docs**

---

### 2. Frontend

```bash
cd frontend

# Install dependencies
npm install

# Start dev server
npm run dev
```

Frontend runs at: **http://localhost:5173**

---

## 🔌 API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/auth/signup` | No | Register new user |
| POST | `/auth/login` | No | Login, returns JWT |
| POST | `/api/predict` | JWT | Predict electricity bill |
| GET | `/api/history` | JWT | Fetch user's prediction history |
| GET | `/health` | No | Health check |

### Example: Signup
```bash
curl -X POST http://localhost:8000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name": "Arjun", "email": "arjun@test.com", "password": "secret123"}'
```

### Example: Predict
```bash
curl -X POST http://localhost:8000/api/predict \
  -H "Authorization: Bearer <your_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "ac_hours": 8,
    "fan_hours": 10,
    "heater_hours": 0,
    "fridge_hours": 24,
    "washing_machine_hours": 1,
    "tv_hours": 5,
    "lights_count": 8,
    "num_people": 4,
    "season": "summer"
  }'
```

---

## 🤖 ML Model

- **Algorithm**: Random Forest Regressor (200 trees, depth 12)
- **Dataset**: 5,000 synthetic Indian household records
- **Features**: AC hours, fan hours, heater hours, fridge hours, washing machine, TV, lights count, number of people, season
- **Performance**: R² = 0.9938, MAE ≈ 13.58 units/month
- **Billing**: India slab tariff (₹3.50–7.50/unit based on consumption)

---

## ✨ Features

- 🔐 JWT authentication (24-hour tokens)
- 🌲 Random Forest with 99.3% accuracy
- 📊 Interactive charts (appliance breakdown + history trend)
- 🌙 Dark mode glassmorphism UI
- 📱 Fully responsive
- 🔔 Toast notifications
- 💾 Prediction history per user (SQLite)
- ⚡ Season-aware predictions (summer/winter/monsoon/spring)

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS, Recharts |
| Backend | FastAPI, SQLAlchemy, Uvicorn |
| Auth | JWT (python-jose), bcrypt (passlib) |
| Database | SQLite (dev) / PostgreSQL (prod) |
| ML | scikit-learn Random Forest, NumPy, Pandas |
| HTTP Client | Axios with interceptors |

---

## Screenshots
<img width="1915" height="966" alt="Screenshot 2026-04-26 184628" src="https://github.com/user-attachments/assets/32c3e846-5959-48d4-9c68-c2c277b4a435" />
<img width="1902" height="913" alt="Screenshot 2026-04-29 123321" src="https://github.com/user-attachments/assets/36ceae4d-4408-4453-b934-24c55b04223e" />
<img width="1898" height="907" alt="Screenshot 2026-04-29 123455" src="https://github.com/user-attachments/assets/1db0ff33-a1ba-49d8-9fe3-6d916bc9dd99" />


