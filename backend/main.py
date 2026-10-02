from datetime import datetime, timezone
from uuid import uuid4

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel


app = FastAPI(title="MIMIC Backend")


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5176",
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# -------------------------------------------------------------------
# Models
# -------------------------------------------------------------------

class SessionCreate(BaseModel):
    session_type: str = "expert_demonstration"


class EventBatch(BaseModel):
    events: list[dict]


# -------------------------------------------------------------------
# In-memory session store
# -------------------------------------------------------------------

sessions = {}


# -------------------------------------------------------------------
# Basic endpoints
# -------------------------------------------------------------------

@app.get("/")
def root():
    return {
        "name": "MIMIC",
        "status": "online",
    }


@app.get("/health")
def health():
    return {
        "status": "healthy",
    }


@app.get("/api/status")
def api_status():
    return {
        "service": "mimic-backend",
        "status": "online",
        "version": "0.1.0",
    }


# -------------------------------------------------------------------
# Expert demonstration sessions
# -------------------------------------------------------------------

@app.post("/api/sessions")
def create_session(payload: SessionCreate):
    session_id = f"EXP-{uuid4().hex[:10].upper()}"

    session = {
        "session_id": session_id,
        "session_type": payload.session_type,
        "status": "recording",
        "created_at": datetime.now(timezone.utc).isoformat(),
        "event_count": 0,
        "events": [],
    }

    sessions[session_id] = session

    return session


@app.get("/api/sessions/{session_id}")
def get_session(session_id: str):
    session = sessions.get(session_id)

    if not session:
        return {
            "error": "session_not_found",
            "session_id": session_id,
        }

    return session


# -------------------------------------------------------------------
# Store interaction trace
# -------------------------------------------------------------------

@app.post("/api/sessions/{session_id}/events")
def add_events(session_id: str, payload: EventBatch):
    session = sessions.get(session_id)

    if not session:
        return {
            "error": "session_not_found",
            "session_id": session_id,
        }

    session["events"].extend(payload.events)
    session["event_count"] = len(session["events"])

    return {
        "session_id": session_id,
        "status": "events_saved",
        "event_count": session["event_count"],
    }


# -------------------------------------------------------------------
# Finalize expert demonstration
# -------------------------------------------------------------------

@app.post("/api/sessions/{session_id}/finalize")
def finalize_session(session_id: str):
    session = sessions.get(session_id)

    if not session:
        return {
            "error": "session_not_found",
            "session_id": session_id,
        }

    session["status"] = "completed"
    session["completed_at"] = datetime.now(timezone.utc).isoformat()

    return session