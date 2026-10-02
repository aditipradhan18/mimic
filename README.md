# MIMIC

### Multimodal AI that learns executable workflows from expert demonstrations and transfers them to novices.

MIMIC is a multimodal workflow intelligence prototype designed to capture how experts perform technical tasks, extract executable workflow knowledge, and help novices reproduce those workflows through contextual guidance.

## Problem

Important expert knowledge is often implicit rather than documented. Traditional manuals explain what to do, but often miss:

- Contextual checks
- Decision points
- Ordering of actions
- Expert shortcuts
- Observable behavioral signals

This can lead to mistakes, slower onboarding, repeated senior assistance, and loss of organizational knowledge.

## Solution

MIMIC observes an expert demonstration through:

- Screen activity
- Voice/narration
- Mouse interactions
- Keyboard interactions
- Timing

The captured interaction trace is transformed into a learned workflow and skill graph containing actions and decision points.

During novice execution, MIMIC compares the novice's actions against the learned workflow, detects deviations, and provides contextual intervention.

## Demo Workflow

The prototype includes an interactive DebugLab demonstration:

1. Open README.md
2. Inspect config.py
3. Check authentication settings
4. Open uth.py
5. Modify the validator
6. Run tests

During novice transfer, intentionally skipping the configuration step triggers a deviation warning and contextual intervention.

Example intervention:

> Before modifying the validator, check the configuration first.

The novice can then follow the learned sequence and complete the workflow.

## Key Features

- Multimodal demonstration capture
- Expert workflow extraction
- Observable implicit decision-signal detection
- Human-in-the-loop approval
- Executable skill graph
- Live novice deviation detection
- Contextual intervention
- Workflow transfer visualization
- Browser-based screen and audio recording
- Interaction event logging

## Architecture

`	ext
EXPERT
  |
  v
Screen + Voice + Click/Keyboard Events
  |
  v
Demonstration Capture / Event Logger
  |
  v
Workflow & Decision Extraction
  |
  v
Candidate Implicit Signal
  |
  v
Human Approval
  |
  v
Skill Graph
  |
  v
NOVICE LIVE ACTIONS
  |
  v
Deviation Detection
  |
  v
Contextual Intervention
  |
  v
Workflow Completion
Technology Stack
Frontend
React
Vite
JavaScript / JSX
Tailwind CSS
Three.js
Framer Motion
Browser MediaRecorder APIs
Backend
Python
FastAPI
Uvicorn
Pydantic
REST APIs
Project Structure
mimic/
├── frontend/
│   ├── public/
│   ├── src/
│   ├── package.json
│   └── ...
│
├── backend/
│   ├── main.py
│   └── ...
│
└── README.md
Running Locally
Frontend
cd frontend
npm install
npm run dev
Backend

Create and activate a Python virtual environment:

cd backend
python -m venv .venv

Windows PowerShell:

.\.venv\Scripts\Activate.ps1

Install dependencies:

pip install fastapi uvicorn pydantic

Start the backend:

uvicorn main:app --reload
Prototype Evaluation

MIMIC can be evaluated using:

Workflow accuracy
Critical-step detection
Task completion
Deviation precision and recall
False intervention rate
Time-to-completion
Future Scope
More advanced multimodal model integration
Real-time voice agent interaction
Richer screen understanding
More complex skill graphs
Persistent organizational skill libraries
Adaptive intervention timing
Hackathon

BFWAI/HACK 26

Problem Statement: PS-05 — Real-Time Voice & Multimodal Agents

Team: mimic'd

Team Lead: Aditi Pradhan

Built as a hackathon prototype demonstrating multimodal workflow learning and transfer.
