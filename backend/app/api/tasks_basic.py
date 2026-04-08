from pydantic import BaseModel
from typing import List
from fastapi import APIRouter

router = APIRouter(
    prefix="/tasks_basic",
    tags=["tasks_basic"]
)

class Task(BaseModel):
    id: int
    title: str
    completed: bool = False

tasks_db: List[Task] = []

@router.get("/", response_model=List[Task])
def list_tasks():
    return tasks_db

@router.post("/", response_model=Task, status_code=201)
def create_task(task: Task):
    tasks_db.append(task)
    return task