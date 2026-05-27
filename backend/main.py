from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
import models
from routers import auth_router, predict_router



app = FastAPI(
    title="Smart Electricity Bill Predictor API",
    description="AI-powered electricity bill prediction with JWT auth",
    version="1.0.0"
)

# Create tables
Base.metadata.create_all(bind=engine)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router.router)
app.include_router(predict_router.router)

@app.get("/")
def root():
    return {"message": "Smart Electricity Predictor API", "status": "running"}

@app.get("/health")
def health():
    return {"status": "ok"}
