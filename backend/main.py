
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="NomadSync API")

# Allow our React frontend to communicate with the backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Sample team members
team_members = [
    {
        "id": 1,
        "name": "Alex Morgan",
        "email": "alex@example.com",
        "country": "Kenya"
    },
    {
        "id": 2,
        "name": "Amina Hassan",
        "email": "amina@example.com",
        "country": "Kenya"
    },
    {
        "id": 3,
        "name": "Oliver Smith",
        "email": "oliver@example.com",
        "country": "United Kingdom"
    },
    {
        "id": 4,
        "name": "Nicha Srisai",
        "email": "nicha@example.com",
        "country": "Thailand"
    },
    {
        "id": 5,
        "name": "Emma de Vries",
        "email": "emma@example.com",
        "country": "Netherlands"
    },
    {
        "id": 6,
        "name": "Thabo Nkosi",
        "email": "thabo@example.com",
        "country": "South Africa"
    },
    {
        "id": 7,
        "name": "Linh Nguyen",
        "email": "linh@example.com",
        "country": "Vietnam"
    },
    {
        "id": 8,
        "name": "Minh Tran",
        "email": "minh@example.com",
        "country": "Vietnam"
    }
]


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


# Get all team members
@app.get("/api/team")
def get_team_members():
    return {
        "team_members": team_members
    }


# Get one team member by ID
@app.get("/api/team/{member_id}")
def get_team_member(member_id: int):
    for member in team_members:
        if member["id"] == member_id:
            return member

    return {"error": "Team member not found"}
