# backend/main.py
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from contextlib import asynccontextmanager

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

# TODO: after testing, lock to your Netlify origin:
# allow_origins=["https://YOUR-SITE-NAME.netlify.app"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://6997aaa477613f372b71ebe8--endearing-souffle-6367b0.netlify.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# If you're now using Alembic, you can comment this out later:
@app.on_event("startup")
async def on_startup():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

@asynccontextmanager
async def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        await db.aclose()


class PlanRequest(BaseModel):
    program_id: str
    earned_credits: int
    completed_courses: List[str]
    target_credits_per_term: int = 15
    terms_to_plan: int = 6
    preferences: Optional[dict] = None


@app.get("/")
def health():
    return {"ok": True, "message": "UNCW Planner API is alive"}


@app.post("/plan")
async def create_plan(req: PlanRequest, db: AsyncSession = Depends(get_db)):
    """
    DB-backed planner:
      - pulls required course codes from program requirements
      - subtracts completed
      - enforces prerequisites
      - packs into terms by target credits, using real course credits
    """
    # 1) Program + requirements
    program = await get_program_by_program_id(db, req.program_id)
    if not program:
        return {"error": f"Program '{req.program_id}' not found"}

    req_rows = await get_program_requirements(db, program.id)
    required_codes = [r.course_code for r in req_rows]

    # 2) Remove completed
    completed = set(req.completed_courses)
    remaining = [c for c in required_codes if c not in completed]

    # 3) Real credits for remaining
    courses = await get_courses_by_codes(db, remaining)
    credits_map = {c.code: c.credits for c in courses}  # default handled below

    # 4) Build prereq map for the remaining set
    prereq_map = await get_prereq_map(db, remaining)
    # Normalize any missing entries to empty set (defensive; get_prereq_map already does)
    for code in remaining:
        prereq_map.setdefault(code, set())

    # 5) Greedy, prereq-aware packing
    plan = []
    taken = set(completed)  # what the student already has
    remaining_codes = remaining[:]  # copy; we'll mutate by terms

    for t in range(1, req.terms_to_plan + 1):
        term_list = []
        term_credits = 0
        scheduled_this_term = set()
        unscheduled_next = []

        # Scan through all remaining courses; pick those eligible & fitting credit cap.
        # If a course isn't eligible *yet*, keep it for the next pass/term.
        for code in remaining_codes:
            prereqs = prereq_map.get(code, set())
            # eligible only if all prereqs have been taken already
            if not prereqs.issubset(taken):
                unscheduled_next.append(code)
                continue

            c_credits = credits_map.get(code, 3)  # fallback to 3 if unknown
            if term_credits + c_credits <= req.target_credits_per_term:
                term_list.append({
                    "course_id": code,
                    "offer_probability": 0.7,  # placeholder; populate from offerings later
                    "risk": "medium"
                })
                term_credits += c_credits
                scheduled_this_term.add(code)
            else:
                # not enough room this term—try next term
                unscheduled_next.append(code)

        plan.append({
            "term_index": t,
            "planned_courses": term_list,
            "credits": term_credits
        })

        # advance: everything we scheduled this term is now 'taken'
        taken |= scheduled_this_term

        # prepare for next term
        # move all unscheduled courses forward; if none were placed and some were deferred for prereqs,
        # we might be in a deadlock (e.g., missing prereqs). Detect & break.
        if len(scheduled_this_term) == 0 and len(unscheduled_next) == len(remaining_codes):
            # Deadlock: no course could be scheduled this term.
            break

        remaining_codes = unscheduled_next

        # Stop if nothing is left
        if not remaining_codes:
            # If there are still more terms requested, pad them as empty terms
            for extra_t in range(t + 1, req.terms_to_plan + 1):
                plan.append({"term_index": extra_t, "planned_courses": [], "credits": 0})
            break

    # Optional: include what's left unscheduled (e.g., due to unmet prereqs or credit cap)
    if remaining_codes:
        return {
            "plan": plan,
            "unscheduled": remaining_codes,
            "note": "Some courses could not be placed (likely due to unmet prerequisites or term credit limits)."
        }

    return {"plan": plan}


# -------- OPTIONAL: one-time seed of sample prerequisites for testing ----------
# Call this once from /docs to add some prereqs, then remove it.
@app.post("/__admin__/seed_prereqs")
async def seed_prereqs(db: AsyncSession = Depends(get_db)):
    try:
        # Example prereqs (adjust to match your catalog reality):
        # CSC 231 requires CSC 133
        # CSC 331 requires CSC 231
        # CSC 340 requires CSC 231
        # CSC 350 requires CSC 231
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