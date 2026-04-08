from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)

def test_auth_status():
    response = client.get("/auth_basic/status")
    assert response.status_code == 200
    assert response.json() == {"auth": "ok"}