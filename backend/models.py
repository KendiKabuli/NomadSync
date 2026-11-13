
from sqlalchemy import Column, Integer, String, Boolean, ForeignKey
from database import Base



class TeamMember(Base):
    __tablename__ = "team_members"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(150), nullable=False, unique=True)
    country = Column(String(100), nullable=False)
    timezone = Column(String(100), nullable=True)
    preferred_start_time = Column(String(10), nullable=True)
    preferred_end_time = Column(String(10), nullable=True)



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
    timezone = Column(String(100), nullable=True)
    participants = Column(Integer, default=2)

class TravelPlan(Base):
    __tablename__ = "travel_plans"

    id = Column(Integer, primary_key=True, index=True)
    member = Column(String(100), nullable=False)
    destination = Column(String(100), nullable=False)
    departure_date = Column(String(20), nullable=False)
    return_date = Column(String(20), nullable=False)
    reason = Column(String(500), nullable=True)
    status = Column(String(30), default="Upcoming")



class HandoverNote(Base):
    __tablename__ = "handover_notes"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    member_id = Column(Integer, nullable=False)
    member_name = Column(String(100), nullable=False)
    task_title = Column(String(200), nullable=True)
    travel_plan_id = Column(Integer, nullable=True)
    deadline = Column(String(20), nullable=True)
    priority = Column(String(20), default="Medium")
    details = Column(String(1000), nullable=False)
    completed = Column(Boolean, default=False)
