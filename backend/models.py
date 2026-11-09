
from sqlalchemy import Column, Integer, String, Boolean, ForeignKey
from database import Base


class TeamMember(Base):
    __tablename__ = "team_members"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(150), nullable=False, unique=True)
    country = Column(String(100), nullable=False)


class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    description = Column(String(500), nullable=True)
    assigned_to = Column(String(100), nullable=False)
    due_date = Column(String(50), nullable=True)
    priority = Column(String(20), default="Medium")
    completed = Column(Boolean, default=False)


class Meeting(Base):
    __tablename__ = "meetings"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    meeting_date = Column(String(20), nullable=False)
    meeting_time = Column(String(20), nullable=False)
    participants = Column(Integer, default=2)