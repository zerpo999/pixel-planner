from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base

# OG advanced routers
from app.api import auth, tasks

# Bella Sprint‑1 routers
from app.api import tasks_basic
from app.api import auth_basic

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Study Planner API")

# Allow CORS for frontend (adjust origin in production)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://pixel-planner-se.web.app",   # your Firebase URL
        "https://pixel-planner-se.firebaseapp.com"  # alternative Firebase domain
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# OG routers (advanced)
app.include_router(auth.router)
app.include_router(tasks.router)

# Bella Sprint‑1 routers (simple)
#app.include_router(tasks_basic.router)
#app.include_router(auth_basic.router)

@app.get("/")
def root():
    return {"message": "Welcome to Study Planner API"}