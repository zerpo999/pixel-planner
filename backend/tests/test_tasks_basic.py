from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)

def test_create_task():
    payload = {"id": 1, "title": "Test task", "completed": False}
    response = client.post("/tasks_basic/", json=payload)
    assert response.status_code == 201
    assert response.json()["title"] == "Test task"

def test_list_tasks():
    response = client.get("/tasks_basic/")
    assert response.status_code == 200
    assert isinstance(response.json(), list)