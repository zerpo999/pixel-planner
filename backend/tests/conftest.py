import pytest
import sys
from pathlib import Path

# Add backend directory to Python path
backend_dir = Path(__file__).parent.parent
sys.path.insert(0, str(backend_dir))

from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.main import app
from app.database import Base
from app.dependencies import get_db   # <-- import from dependencies, not database

# Use a separate test database file
TEST_DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(TEST_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

@pytest.fixture(scope="session", autouse=True)
def create_test_db():
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)

@pytest.fixture
def client():
    with TestClient(app) as test_client:
        yield test_client

@pytest.fixture
def auth_headers(client):
    """Register and login a test user, return authorization headers."""
    # Register
    client.post("/auth/register", json={
        "username": "testuser",
        "password": "Test123!",
        "full_name": "Test User"
    })
    # Login
    response = client.post("/auth/login", data={
        "username": "testuser",
        "password": "Test123!"
    })
    token = response.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}