# backend/main.py
from typing import List, Optional, AsyncGenerator

from fastapi import FastAPI, Depends, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from sqlalchemy.ext.asyncio import AsyncSession

from db import SessionLocal, engine
from models import Base, Program, ProgramRequirement, Course, CoursePrereq
from crud import (
    get_program_by_program_id,
    get_program_requirements,
    get_courses_by_codes,
    get_prereq_map,
)

app = FastAPI(title="UNCW Planner API (MVP)")

# --- CORS ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://endearing-souffle-6367b0.netlify.app",
        "http://localhost:5173",
    ],
    allow_origin_regex=r"https://[a-z0-9-]+--endearing-souffle-6367b0\.netlify\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Debug ---
@app.get("/__debug__/headers")
async def debug_headers(request: Request):
    return {
        "received_origin": request.headers.get("origin"),
        "host": request.headers.get("host"),
        "x_forwarded_proto": request.headers.get("x-forwarded-proto"),
    }

# --- Startup (MVP) ---
@app.on_event("startup")
async def on_startup():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

# --- DB dependency ---
async def get_db() -> AsyncGenerator[AsyncSession, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        await db.aclose()

# --- Schemas ---
class PlanRequest(BaseModel):
    program_id: str
    earned_credits: int
    completed_courses: List[str]
    target_credits_per_term: int = 15
    terms_to_plan: int = 6
    preferences: Optional[dict] = None

# --- Routes ---
@app.get("/")
def health():
    return {"ok": True, "message": "UNCW Planner API is alive"}

@app.get("/schema.json")
def schema():
    # Manual OpenAPI route that should pick up CORS like any normal route
    return app.openapi()

@app.options("/{rest_of_path:path}")
async def options_catch_all(rest_of_path: str):
    # Helps surface preflight behavior cleanly during debugging
    return Response(status_code=204)

@app.post("/plan")
async def create_plan(req: PlanRequest, db: AsyncSession = Depends(get_db)):
    program = await get_program_by_program_id(db, req.program_id)
    if not program:
        return {"error": f"Program '{req.program_id}' not found"}

    req_rows = await get_program_requirements(db, program.id)
    required_codes = [r.course_code for r in req_rows]

    completed = set(req.completed_courses)
    remaining = [c for c in required_codes if c not in completed]

    courses = await get_courses_by_codes(db, remaining)
    credits_map = {c.code: c.credits for c in courses}

    prereq_map = await get_prereq_map(db, remaining)
    for code in remaining:
        prereq_map.setdefault(code, set())

    plan = []
    taken = set(completed)
    remaining_codes = remaining[:]

    for t in range(1, req.terms_to_plan + 1):
        term_list = []
        term_credits = 0
        scheduled_this_term = set()
        unscheduled_next = []

        for code in remaining_codes:
            prereqs = prereq_map.get(code, set())
            if not prereqs.issubset(taken):
                unscheduled_next.append(code)
                continue

            c_credits = credits_map.get(code, 3)
            if term_credits + c_credits <= req.target_credits_per_term:
                term_list.append({
                    "course_id": code,
                    "offer_probability": 0.7,
                    "risk": "medium"
                })
                term_credits += c_credits
                scheduled_this_term.add(code)
            else:
                unscheduled_next.append(code)

        plan.append({
            "term_index": t,
            "planned_courses": term_list,
            "credits": term_credits
        })

        taken |= scheduled_this_term

        if len(scheduled_this_term) == 0 and len(unscheduled_next) == len(remaining_codes):
            break

        remaining_codes = unscheduled_next

        if not remaining_codes:
            for extra_t in range(t + 1, req.terms_to_plan + 1):
                plan.append({"term_index": extra_t, "planned_courses": [], "credits": 0})
            break

    if remaining_codes:
        return {
            "plan": plan,
            "unscheduled": remaining_codes,
            "note": "Some courses could not be placed (likely due to unmet prerequisites or term credit limits)."
        }

    return {"plan": plan}

@app.post("/__admin__/seed_prereqs")
async def seed_prereqs(db: AsyncSession = Depends(get_db)):
    try:
        code_to_id = {}
        for c in await get_courses_by_codes(db, ["CSC 133", "CSC 231", "CSC 331", "CSC 340", "CSC 350"]):
            code_to_id[c.code] = c.id

        rows: list[CoursePrereq] = []

        def add(course_code: str, prereq_code: str):
            cid = code_to_id.get(course_code)
            if cid:
                rows.append(CoursePrereq(course_id_fk=cid, prereq_course_code=prereq_code))

        add("CSC 231", "CSC 133")
        add("CSC 331", "CSC 231")
        add("CSC 340", "CSC 231")
        add("CSC 350", "CSC 231")

        for r in rows:
            db.add(r)
        await db.commit()
        return {"ok": True, "inserted": len(rows)}
    except Exception as e:
        await db.rollback()
        return {"ok": False, "error": str(e)}