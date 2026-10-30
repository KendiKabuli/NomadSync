
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy.orm import Session

from database import engine, SessionLocal, Base
from models import TeamMember

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
