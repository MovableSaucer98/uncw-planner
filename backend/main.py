# backend/main.py
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from contextlib import asynccontextmanager

# ---- DB / models / queries ----
# Use absolute imports (no leading dots) because main.py is run as a top-level module.
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.exc import SQLAlchemyError

from db import SessionLocal, engine
from models import Base, Program, ProgramRequirement, Course
from crud import (
    get_program_by_program_id,
    get_program_requirements,
    get_courses_by_codes,
)

# -------------------------------
# FastAPI app + CORS
# -------------------------------
app = FastAPI(title="UNCW Planner API (MVP)")

# TEMP: allow all origins while testing; later lock this to your actual Netlify URL.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://6997aaa477613f372b71ebe8--endearing-souffle-6367b0.netlify.app/"],  # e.g., ["https://your-site.netlify.app"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------------------
# Create tables on startup (MVP)
# (Later, switch to Alembic migrations)
# -------------------------------
@app.on_event("startup")
async def on_startup():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

# -------------------------------
# DB session dependency (async)
# -------------------------------
@asynccontextmanager
async def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        await db.aclose()

# -------------------------------
# Schemas
# -------------------------------
class PlanRequest(BaseModel):
    program_id: str
    earned_credits: int
    completed_courses: List[str]
    target_credits_per_term: int = 15
    terms_to_plan: int = 6
    preferences: Optional[dict] = None

# -------------------------------
# Health
# -------------------------------
@app.get("/")
def health():
    return {"ok": True, "message": "UNCW Planner API is alive"}

# -------------------------------
# (TEMP) One-time seed endpoint
# Call once from /docs after deployment, then remove if you want.
# -------------------------------
@app.post("/__admin__/seed")
async def seed(db: AsyncSession = Depends(get_db)):
    try:
        # program
        prog = Program(
            program_id="BS-CS-2025",
            name="B.S. Computer Science",
            total_credits=120,
        )
        db.add(prog)
        await db.flush()  # get prog.id

        # minimal course set (example credits)
        seed_courses = [
            ("CSC 121", "Intro to CS", 3),
            ("CSC 133", "OOP", 3),
            ("CSC 231", "Data Structures", 3),
            ("CSC 331", "Algorithms", 3),
            ("CSC 340", "Systems", 3),
            ("CSC 350", "Software Eng", 3),
            ("MAT 161", "Calc I", 4),
            ("MAT 162", "Calc II", 4),
            ("STT 215", "Statistics", 3),
            ("CSC 432", "Elective 1", 3),
            ("CSC 442", "Elective 2", 3),
            ("CSC 450", "Elective 3", 3),
            ("CSC 485", "Elective 4", 3),
        ]
        for code, title, credits in seed_courses:
            db.add(Course(code=code, title=title, credits=credits))

        # requirements (core + electives)
        core = [
            "CSC 121",
            "CSC 133",
            "CSC 231",
            "CSC 331",
            "CSC 340",
            "CSC 350",
            "MAT 161",
            "MAT 162",
            "STT 215",
        ]
        for c in core:
            db.add(
                ProgramRequirement(
                    program_id_fk=prog.id, course_code=c, kind="core"
                )
            )
        for c in ["CSC 432", "CSC 442", "CSC 450", "CSC 485"]:
            db.add(
                ProgramRequirement(
                    program_id_fk=prog.id, course_code=c, kind="elective"
                )
            )

        await db.commit()
        return {"ok": True}
    except Exception as e:
        await db.rollback()
        return {"ok": False, "error": str(e)}

# -------------------------------
# Planner
# -------------------------------
@app.post("/plan")
async def create_plan(req: PlanRequest, db: AsyncSession = Depends(get_db)):
    """
    Build a simple multi-term plan from DB-backed program requirements.
    Packs courses greedily by target credits/term.
    """
    # 1) load program
    program = await get_program_by_program_id(db, req.program_id)
    if not program:
        return {"error": f"Program '{req.program_id}' not found"}

    # 2) fetch requirement rows -> flatten to course codes
    req_rows = await get_program_requirements(db, program.id)
    required_codes = [r.course_code for r in req_rows]

    # 3) subtract completed
    remaining_codes = [c for c in required_codes if c not in req.completed_courses]

    # 4) look up real credits for remaining courses (fallback to 3 if missing)
    courses = await get_courses_by_codes(db, remaining_codes)
    credits_map = {c.code: c.credits for c in courses}

    # 5) greedy packing into terms
    plan = []
    i = 0
    for t in range(req.terms_to_plan):
        term_list = []
        credits = 0
        while i < len(remaining_codes):
            code = remaining_codes[i]
            c_credits = credits_map.get(code, 3)  # default to 3 if unknown
            if credits + c_credits > req.target_credits_per_term:
                break
            term_list.append(
                {
                    "course_id": code,
                    "offer_probability": 0.7,  # placeholder; later compute from offerings
                    "risk": "medium",
                }
            )
            credits += c_credits
            i += 1
        plan.append({"term_index": t + 1, "planned_courses": term_list, "credits": credits})

    return {"plan": plan}