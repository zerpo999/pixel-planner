from fastapi.testclient import TestClient

def test_register_success(client: TestClient):
    response = client.post("/auth/register", json={
        "username": "newuser",
        "password": "Test123!",
        "full_name": "New User"
    })
    assert response.status_code == 200
    data = response.json()
    assert data["username"] == "newuser"

def test_register_duplicate_username(client: TestClient):
    client.post("/auth/register", json={
        "username": "duplicate",
        "password": "Test123!",
        "full_name": "Duplicate"
    })
    response = client.post("/auth/register", json={
        "username": "duplicate",
        "password": "Test123!",
        "full_name": "Duplicate"
    })
    assert response.status_code == 400
    assert "Username already registered" in response.text

def test_login_success(client: TestClient):
    client.post("/auth/register", json={
        "username": "loginuser",
        "password": "Test123!",
        "full_name": "Login User"
    })
    response = client.post("/auth/login", data={
        "username": "loginuser",
        "password": "Test123!"
    })
    assert response.status_code == 200
    assert "access_token" in response.json()

def test_create_task(client: TestClient, auth_headers):
    response = client.post("/tasks", json={
        "title": "Integration test task",
        "due_date": "2025-12-31T23:59:59",
        "priority": "high",
        "category": "Homework",
        "color_code": "#FF0000"
    }, headers=auth_headers)
    assert response.status_code == 200
    task = response.json()
    assert task["title"] == "Integration test task"
    assert task["category"] == "Homework"
    assert task["due_date"] == "2025-12-31T23:59:59"

def test_update_task_preserves_fields(client: TestClient, auth_headers):
    # Create a task
    create_resp = client.post("/tasks", json={
        "title": "Preserve test",
        "due_date": "2025-06-01T10:00:00",
        "priority": "medium",
        "category": "Reading",
        "color_code": "#00FF00"
    }, headers=auth_headers)
    task_id = create_resp.json()["id"]

    # Update only the completed flag
    update_resp = client.put(f"/tasks/{task_id}", json={
        "completed": True
    }, headers=auth_headers)
    assert update_resp.status_code == 200
    updated = update_resp.json()

    # Critical checks: due_date and category must not be lost
    assert updated["due_date"] == "2025-06-01T10:00:00"
    assert updated["category"] == "Reading"
    assert updated["completed"] == True
    assert updated["title"] == "Preserve test"

def test_streak_after_completion(client: TestClient, auth_headers):
    create_resp = client.post("/tasks", json={
        "title": "Streak task"
    }, headers=auth_headers)
    task_id = create_resp.json()["id"]

    # Complete it
    client.put(f"/tasks/{task_id}", json={"completed": True}, headers=auth_headers)

    # Get streak
    streak_resp = client.get("/tasks/streak", headers=auth_headers)
    assert streak_resp.status_code == 200
    streak = streak_resp.json()
    assert streak["current_streak"] >= 1

def test_tasks_isolation(client: TestClient, auth_headers):
    # Create task for first user
    client.post("/tasks", json={"title": "User A task"}, headers=auth_headers)

    # Register and login a second user
    client.post("/auth/register", json={
        "username": "userB",
        "password": "Test123!",
        "full_name": "User B"
    })
    login_b = client.post("/auth/login", data={"username": "userB", "password": "Test123!"})
    token_b = login_b.json()["access_token"]
    headers_b = {"Authorization": f"Bearer {token_b}"}

    # Second user should see no tasks
    list_b = client.get("/tasks", headers=headers_b)
    assert len(list_b.json()) == 0

def test_delete_task(client: TestClient, auth_headers):
    create_resp = client.post("/tasks", json={"title": "To be deleted"}, headers=auth_headers)
    task_id = create_resp.json()["id"]

    del_resp = client.delete(f"/tasks/{task_id}", headers=auth_headers)
    assert del_resp.status_code == 200

    # Verify it's gone
    list_resp = client.get("/tasks", headers=auth_headers)
    assert all(t["id"] != task_id for t in list_resp.json())

def test_create_task_missing_optional_fields(client, auth_headers):
    """Title is required; due_date, category, priority should be optional."""
    resp = client.post("/tasks", json={"title": "Minimal task"}, headers=auth_headers)
    assert resp.status_code == 200
    data = resp.json()
    assert data["due_date"] is None
    assert data["category"] is None
    assert data["priority"] == "medium"  # default

def test_update_task_clear_due_date(client, auth_headers):
    """Explicitly setting due_date to null should clear it."""
    create = client.post("/tasks", json={"title": "Task", "due_date": "2025-12-31T00:00:00"}, headers=auth_headers)
    task_id = create.json()["id"]
    update = client.put(f"/tasks/{task_id}", json={"due_date": None}, headers=auth_headers)
    assert update.json()["due_date"] is None

def test_unauthenticated_access_returns_401(client):
    resp = client.get("/tasks")
    assert resp.status_code == 401