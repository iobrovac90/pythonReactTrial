from sqlalchemy import Column, Integer, String, Boolean
from .database import Base

class TodoItem(Base):
    __tablename__ = "todo_items"

    id = Column(Integer, primary_key=True, index=True)  # Added `id` as primary key
    task = Column(String, index=True)
    completed = Column(Boolean, default=False)  # Boolean type for completed

# app/models.py
from pydantic import BaseModel

# Define the Pydantic model for creating a new TodoItem
class TodoItemCreate(BaseModel):
    task: str
    completed: bool = False  # Default to False

    class Config:
        orm_mode = True  # This tells Pydantic to treat the ORM model (SQLAlchemy) like a dictionary

# Define the Pydantic model for returning a TodoItem
class TodoItemResponse(BaseModel):
    id: int
    task: str
    completed: bool

    class Config:
        orm_mode = True  # This tells Pydantic to treat the ORM model (SQLAlchemy) like a dictionary