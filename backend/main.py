
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy.orm import Session
from typing import Optional

from database import engine, SessionLocal, Base
from models import TeamMember, Task

app = FastAPI(title="NomadSync API")

# Allow our React frontend to communicate with the backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create database tables if they do not exist
Base.metadata.create_all(bind=engine)


# Request model for adding team members
class TeamMemberCreate(BaseModel):
    name: str
    email: str
    country: str


# Request model for creating tasks
class TaskCreate(BaseModel):
    title: str
    description: Optional[str] = None
    assigned_to: str
    due_date: Optional[str] = None
    priority: str = "Medium"


# Request model for updating tasks
class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    assigned_to: Optional[str] = None
    due_date: Optional[str] = None
    priority: Optional[str] = None
    completed: Optional[bool] = None


# Original eight team members
initial_team = [
    {
        "name": "Alex Morgan",
        "email": "alex@example.com",
        "country": "Kenya"
    },
    {
        "name": "Amina Hassan",
        "email": "amina@example.com",
        "country": "Kenya"
    },
    {
        "name": "Oliver Smith",
        "email": "oliver@example.com",
        "country": "United Kingdom"
    },
    {
        "name": "Nicha Srisai",
        "email": "nicha@example.com",
        "country": "Thailand"
    },
    {
        "name": "Emma de Vries",
        "email": "emma@example.com",
        "country": "Netherlands"
    },
    {
        "name": "Thabo Nkosi",
        "email": "thabo@example.com",
        "country": "South Africa"
    },
    {
        "name": "Linh Nguyen",
        "email": "linh@example.com",
        "country": "Vietnam"
    },
    {
        "name": "Minh Tran",
        "email": "minh@example.com",
        "country": "Vietnam"
    }
]


# Get a database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# Convert a task database record into a response dictionary
def task_to_dict(task):
    return {
        "id": task.id,
        "title": task.title,
        "description": task.description,
        "assigned_to": task.assigned_to,
        "due_date": task.due_date,
        "priority": task.priority,
        "completed": task.completed
    }


# Add the original team members if the database is empty
@app.on_event("startup")
def seed_team_members():
    db = SessionLocal()

    try:
        if db.query(TeamMember).count() == 0:
            for member in initial_team:
                new_member = TeamMember(**member)
                db.add(new_member)

            db.commit()

    finally:
        db.close()


@app.get("/")
def home():
    return {
        "message": "Welcome to NomadSync!",
        "status": "Backend is running successfully"
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy"
    }


# ---------------- TEAM MEMBER ENDPOINTS ----------------

# Get all team members from PostgreSQL
@app.get("/api/team")
def get_team_members(db: Session = Depends(get_db)):
    members = db.query(TeamMember).order_by(TeamMember.id).all()

    return {
        "team_members": [
            {
                "id": member.id,
                "name": member.name,
                "email": member.email,
                "country": member.country
            }
            for member in members
        ]
    }


# Get one team member by ID
@app.get("/api/team/{member_id}")
def get_team_member(
    member_id: int,
    db: Session = Depends(get_db)
):
    member = db.query(TeamMember).filter(
        TeamMember.id == member_id
    ).first()

    if not member:
        raise HTTPException(
            status_code=404,
            detail="Team member not found"
        )

    return {
        "id": member.id,
        "name": member.name,
        "email": member.email,
        "country": member.country
    }


# Add a new team member to PostgreSQL
@app.post("/api/team")
def add_team_member(
    member: TeamMemberCreate,
    db: Session = Depends(get_db)
):
    existing_member = db.query(TeamMember).filter(
        TeamMember.email == member.email
    ).first()

    if existing_member:
        raise HTTPException(
            status_code=409,
            detail="A team member with this email already exists"
        )

    new_member = TeamMember(
        name=member.name,
        email=member.email,
        country=member.country
    )

    db.add(new_member)
    db.commit()
    db.refresh(new_member)

    return {
        "message": "Team member added successfully",
        "team_member": {
            "id": new_member.id,
            "name": new_member.name,
            "email": new_member.email,
            "country": new_member.country
        }
    }

# UPDATE AN EXISTING TEAM MEMBER
@app.put("/api/team/{member_id}")
def update_team_member(
    member_id: int,
    member: TeamMemberCreate,
    db: Session = Depends(get_db)
):
    existing_member = db.query(TeamMember).filter(
        TeamMember.id == member_id
    ).first()

    if not existing_member:
        raise HTTPException(
            status_code=404,
            detail="Team member not found"
        )

    duplicate_email = db.query(TeamMember).filter(
        TeamMember.email == member.email,
        TeamMember.id != member_id
    ).first()

    if duplicate_email:
        raise HTTPException(
            status_code=409,
            detail="Another team member already uses this email"
        )

    existing_member.name = member.name
    existing_member.email = member.email
    existing_member.country = member.country

    db.commit()
    db.refresh(existing_member)

    return {
        "message": "Team member updated successfully",
        "member": {
            "id": existing_member.id,
            "name": existing_member.name,
            "email": existing_member.email,
            "country": existing_member.country
        }
    }

    


# ---------------- TASK ENDPOINTS ----------------

# Get all tasks from PostgreSQL
@app.get("/api/tasks")
def get_tasks(db: Session = Depends(get_db)):
    tasks = db.query(Task).order_by(Task.id).all()

    return {
        "tasks": [task_to_dict(task) for task in tasks]
    }


# Get one task by ID
@app.get("/api/tasks/{task_id}")
def get_task(
    task_id: int,
    db: Session = Depends(get_db)
):
    task = db.query(Task).filter(Task.id == task_id).first()

    if not task:
        raise HTTPException(
            status_code=404,
            detail="Task not found"
        )

    return task_to_dict(task)


# Add a new task to PostgreSQL
@app.post("/api/tasks")
def add_task(
    task_data: TaskCreate,
    db: Session = Depends(get_db)
):
    new_task = Task(
        title=task_data.title,
        description=task_data.description,
        assigned_to=task_data.assigned_to,
        due_date=task_data.due_date,
        priority=task_data.priority,
        completed=False
    )

    db.add(new_task)
    db.commit()
    db.refresh(new_task)

    return {
        "message": "Task added successfully",
        "task": task_to_dict(new_task)
    }


# Update an existing task
@app.put("/api/tasks/{task_id}")
def update_task(
    task_id: int,
    task_data: TaskUpdate,
    db: Session = Depends(get_db)
):
    task = db.query(Task).filter(Task.id == task_id).first()

    if not task:
        raise HTTPException(
            status_code=404,
            detail="Task not found"
        )

    updates = task_data.dict(exclude_unset=True)

    # Do not overwrite required fields with null values
    for field in ["title", "assigned_to", "priority", "completed"]:
        if field in updates and updates[field] is None:
            updates.pop(field)

    for field, value in updates.items():
        setattr(task, field, value)

    db.commit()
    db.refresh(task)

    return {
        "message": "Task updated successfully",
        "task": task_to_dict(task)
    }


# Delete a task
@app.delete("/api/tasks/{task_id}")
def delete_task(
    task_id: int,
    db: Session = Depends(get_db)
):
    task = db.query(Task).filter(Task.id == task_id).first()

    if not task:
        raise HTTPException(
            status_code=404,
            detail="Task not found"
        )

    db.delete(task)
    db.commit()

    return {
        "message": "Task deleted successfully"
    }
