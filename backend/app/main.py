from fastapi import FastAPI, HTTPException, Depends
from sqlalchemy.orm import Session
from .models import TodoItem, TodoItemCreate, TodoItemResponse
from .database import SessionLocal, engine, Base
from typing import List
from fastapi.middleware.cors import CORSMiddleware


# Create the FastAPI app instance
app = FastAPI()

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Replace with the frontend's URL
    allow_credentials=True,
    allow_methods=["*"],  # Allows all HTTP methods (GET, POST, PUT, DELETE, etc.)
    allow_headers=["*"],  # Allows all headers
)

# Create the database tables if they don't exist
Base.metadata.create_all(bind=engine)

# Dependency to get the database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Create a new to-do item
@app.post("/todos/", response_model=TodoItemResponse)
def create_todo(todo: TodoItemCreate, db: Session = Depends(get_db)):
    db_todo = TodoItem(task=todo.task, completed=todo.completed)
    db.add(db_todo)
    db.commit()
    db.refresh(db_todo)
    return db_todo

# Get all to-do items
@app.get("/todos/", response_model=List[TodoItemResponse])
def get_todos(db: Session = Depends(get_db)):
    return db.query(TodoItem).all()

# Get a specific to-do item by ID
@app.get("/todos/{todo_id}", response_model=TodoItemResponse)
def get_todo(todo_id: int, db: Session = Depends(get_db)):
    db_todo = db.query(TodoItem).filter(TodoItem.id == todo_id).first()
    if db_todo is None:
        raise HTTPException(status_code=404, detail="Todo item not found")
    return db_todo

# Update a to-do item
@app.put("/todos/{todo_id}", response_model=TodoItemResponse)
def update_todo(todo_id: int, todo: TodoItemCreate, db: Session = Depends(get_db)):
    db_todo = db.query(TodoItem).filter(TodoItem.id == todo_id).first()
    if db_todo is None:
        raise HTTPException(status_code=404, detail="Todo item not found")
    db_todo.task = todo.task
    db_todo.completed = todo.completed
    db.commit()
    db.refresh(db_todo)
    return db_todo

# Delete a to-do item
@app.delete("/todos/{todo_id}")
def delete_todo(todo_id: int, db: Session = Depends(get_db)):
    db_todo = db.query(TodoItem).filter(TodoItem.id == todo_id).first()
    if db_todo is None:
        raise HTTPException(status_code=404, detail="Todo item not found")
    db.delete(db_todo)
    db.commit()
    return {"detail": "Todo item deleted"}