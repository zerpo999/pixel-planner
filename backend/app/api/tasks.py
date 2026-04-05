from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from .. import schemas, crud, dependencies
from datetime import datetime

router = APIRouter(prefix="/tasks", tags=["tasks"])

@router.post("/", response_model=schemas.Task)
def create_task(task: schemas.TaskCreate, db: Session = Depends(dependencies.get_db), current_user = Depends(dependencies.get_current_user)):
    return crud.create_task(db, task, current_user.id)

@router.get("/", response_model=List[schemas.Task])
def list_tasks(
    skip: int = 0,
    limit: int = 100,
    completed: Optional[bool] = Query(None),
    db: Session = Depends(dependencies.get_db),
    current_user = Depends(dependencies.get_current_user)
):
    return crud.get_tasks(db, current_user.id, skip=skip, limit=limit, completed=completed)

@router.get("/history", response_model=List[schemas.Task])
def get_history(
    db: Session = Depends(dependencies.get_db),
    current_user = Depends(dependencies.get_current_user)
):
    return crud.get_tasks(db, current_user.id, completed=True)

@router.put("/{task_id}", response_model=schemas.Task)
def update_task(
    task_id: int,
    task_update: schemas.TaskUpdate,
    db: Session = Depends(dependencies.get_db),
    current_user = Depends(dependencies.get_current_user)
):
    task = crud.update_task(db, task_id, task_update, current_user.id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    # If task was just completed, update streak
    if task_update.completed == True and task.completed:
        # Only if it changed to completed (already handled in crud)
        crud.update_streak(db, current_user.id, task.completed_at)
    return task

@router.delete("/{task_id}")
def delete_task(task_id: int, db: Session = Depends(dependencies.get_db), current_user = Depends(dependencies.get_current_user)):
    if not crud.delete_task(db, task_id, current_user.id):
        raise HTTPException(status_code=404, detail="Task not found")
    return {"ok": True}

@router.get("/streak", response_model=schemas.Streak)
def get_streak(db: Session = Depends(dependencies.get_db), current_user = Depends(dependencies.get_current_user)):
    streak = crud.get_streak(db, current_user.id)
    if not streak:
        streak = crud.update_streak(db, current_user.id)
    return streak