from sqlalchemy.orm import Session
from . import models, schemas
from .utils import get_password_hash
from datetime import datetime

# User CRUD
def get_user_by_username(db: Session, username: str):
    return db.query(models.User).filter(models.User.username == username).first()

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def create_user(db: Session, user: schemas.UserCreate):
    hashed_password = get_password_hash(user.password)
    db_user = models.User(
        username=user.username,
        full_name=user.full_name,
        email=user.email,
        hashed_password=hashed_password
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    # Create streak record
    db_streak = models.Streak(user_id=db_user.id)
    db.add(db_streak)
    db.commit()
    return db_user

# Task CRUD
def get_tasks(db: Session, user_id: int, skip: int = 0, limit: int = 100, completed: bool = None):
    query = db.query(models.Task).filter(models.Task.user_id == user_id)
    if completed is not None:
        query = query.filter(models.Task.completed == completed)
    return query.offset(skip).limit(limit).all()

def get_task(db: Session, task_id: int, user_id: int):
    return db.query(models.Task).filter(models.Task.id == task_id, models.Task.user_id == user_id).first()

def create_task(db: Session, task: schemas.TaskCreate, user_id: int):
    db_task = models.Task(**task.dict(), user_id=user_id)
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task

def update_task(db: Session, task_id: int, task_update: schemas.TaskUpdate, user_id: int):
    db_task = get_task(db, task_id, user_id)
    if not db_task:
        return None
    update_data = task_update.dict(exclude_unset=True)
    # If marking as completed, set completed_at
    if "completed" in update_data and update_data["completed"] and not db_task.completed:
        update_data["completed_at"] = datetime.utcnow()
    for key, value in update_data.items():
        setattr(db_task, key, value)
    db.commit()
    db.refresh(db_task)
    return db_task

def delete_task(db: Session, task_id: int, user_id: int):
    db_task = get_task(db, task_id, user_id)
    if db_task:
        db.delete(db_task)
        db.commit()
        return True
    return False

# Streak CRUD
def get_streak(db: Session, user_id: int):
    return db.query(models.Streak).filter(models.Streak.user_id == user_id).first()

def update_streak(db: Session, user_id: int, completion_date: datetime = None):
    if completion_date is None:
        completion_date = datetime.utcnow()
    streak = get_streak(db, user_id)
    if not streak:
        streak = models.Streak(user_id=user_id)
        db.add(streak)
        db.commit()
        db.refresh(streak)
    today = completion_date.date()
    if streak.last_completed_date:
        last_date = streak.last_completed_date.date()
        if last_date == today:
            return streak
        elif last_date == today - timedelta(days=1):
            streak.current_streak += 1
            if streak.current_streak > streak.longest_streak:
                streak.longest_streak = streak.current_streak
        else:
            streak.current_streak = 1
    else:
        streak.current_streak = 1
        if streak.current_streak > streak.longest_streak:
            streak.longest_streak = streak.current_streak
    streak.last_completed_date = completion_date
    db.commit()
    db.refresh(streak)
    return streak

# Helper for timedelta
from datetime import timedelta