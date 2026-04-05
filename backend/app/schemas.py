from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional

class TaskBase(BaseModel):
    title: str
    description: Optional[str] = None
    category: Optional[str] = None
    color_code: Optional[str] = None
    due_date: Optional[datetime] = None
    priority: Optional[str] = "medium"

class TaskCreate(TaskBase):
    pass

class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    color_code: Optional[str] = None
    due_date: Optional[datetime] = None
    priority: Optional[str] = None
    completed: Optional[bool] = None

class Task(TaskBase):
    id: int
    completed: bool
    completed_at: Optional[datetime] = None
    created_at: datetime
    user_id: int
    class Config:
        from_attributes = True

class UserBase(BaseModel):
    username: str
    full_name: Optional[str] = None
    email: Optional[EmailStr] = None

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    is_active: bool
    tasks: list[Task] = []
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

class StreakBase(BaseModel):
    current_streak: int
    longest_streak: int
    last_completed_date: Optional[datetime]

class Streak(StreakBase):
    user_id: int
    class Config:
        from_attributes = True