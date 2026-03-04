# backend/main.py

from __future__ import annotations

from typing import List, Optional, Dict, Any, AsyncGenerator

from fastapi import FastAPI, Depends, Request, Response, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field

from sqlalchemy.ext.asyncio import AsyncSession

# Project-local imports (existing in your repo)
from db import SessionLocal, engine
from models import Base, Program, ProgramRequirement, Course, CoursePrereq
from crud import (
    get_program_by_program_id,
    get_program_requirements,
    get_courses_by_codes,
    get_prereq_map,
)

import os

# ------------------------------------------------------------------------------
# App
# ------------------------------------------------------------------------------

app = FastAPI(title="UNCW Planner API (MVP)")

# ------------------------------------------------------------------------------
# CORS  (expanded: Astro dev :4321, Vite :5173, Netlify site + previews)
# NOTE: You had explicit Netlify origin + a deploy-preview regex already. We keep
#       those and add explicit dev origins so local/preview both work. [1](https://github.com/uncw)
# ------------------------------------------------------------------------------

ALLOWED_ORIGINS = [
    # Local dev (Astro default)
    "http://localhost:4321",
    "http://127.0.0.1:4321",
    # Local dev (Vite, if you still use it)
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    # Your Netlify production site (update if you change the subdomain)
    "https://endearing-souffle-6367b0.netlify.app",
]

# Keep your deploy-preview regex (Netlify preview URLs)
ALLOWED_ORIGIN_REGEX = r"https://[a-z0-9-]+--endearing-souffle-6367b0\.netlify\.app"

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_origin_regex=ALLOWED_ORIGIN_REGEX,
    allow_credentials=True,      # safe because we list explicit origins
    allow_methods=["*"],
    allow_headers=["*"],
)

# ------------------------------------------------------------------------------
# Startup: create tables (MVP)
# ------------------------------------------------------------------------------

@app.on_event("startup")
async def on_startup():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

# ------------------------------------------------------------------------------
# DB dependency (async)
# ------------------------------------------------------------------------------

async def get_db() -> AsyncGenerator[AsyncSession, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        await db.aclose()

# ------------------------------------------------------------------------------
# Schemas
# ------------------------------------------------------------------------------

class PlanRequest(BaseModel):
    # You previously planned around program_id + credits; keep that:
    program_id: Optional[str] = None
    earned_credits: int = 0
    completed_courses: List[str] = []

    # Rich inputs you’ll need for the full UI:
    major: Optional[str] = None
    minor: Optional[str] = None
    career: Optional[str] = None

    # Global constraints:
    target_credits_per_term: int = Field(15, ge=1, le=21)
    terms_to_plan: int = Field(6, ge=1, le=12)
    summer_term: bool = False

    # Preferences + hard constraints:
    must_take: List[str] = []
    do_not_take: List[str] = []

    # Per-term overrides (optional): { "Fall 2026": 18, "Spring 2027": 12 }
    per_term_credit_caps: Dict[str, int] = {}

    # Arbitrary preferences container (extensible):
    preferences: Optional[Dict[str, Any]] = None


class SectionBlock(BaseModel):
    code: str
    title: Optional[str] = None
    credits: int = 3
    days: List[str] = []          # e.g., ["Mon","Wed","Fri"]
    time: Optional[str] = None    # e.g., "10:00-10:50"
    required: bool = False        # required vs elective
    locked: bool = False          # no-flex (locked) for schedule


class TermPlan(BaseModel):
    name: str                     # e.g., "Fall 2026"
    credit_cap: int
    sections: List[SectionBlock] = []


class PlanResponse(BaseModel):
    terms: List[TermPlan]
    recommendations: Dict[str, Any] = {}

# ------------------------------------------------------------------------------
# Utility: simple cert recommendations (MVP)
# ------------------------------------------------------------------------------

CAREER_CERTS = {
    "software engineer": ["AWS Cloud Practitioner", "GitHub Foundations"],
    "cybersecurity": ["CompTIA Security+", "Network+"],
    "data analyst": ["Google Data Analytics", "Tableau Specialist"],
}

def recommend_certs(career: Optional[str]) -> List[str]:
    if not career:
        return []
    return CAREER_CERTS.get(career.lower(), [])

# ------------------------------------------------------------------------------
# Public routes
# ------------------------------------------------------------------------------

@app.get("/")
def health():
    return {"ok": True, "message": "UNCW Planner API is alive"}

@app.get("/version")
def version():
    # Set RENDER_GIT_COMMIT in Render (or leave "dev" locally)
    return {"version": os.getenv("RENDER_GIT_COMMIT", "dev")}

@app.get("/schema.json")
def schema():
    # Manual OpenAPI endpoint; useful for testing that CORS applies to “normal” routes too
    return app.openapi()

@app.get("/__debug__/headers")
async def debug_headers(request: Request):
    # Keep this; it’s extremely helpful to confirm Origin/proxy headers in CORS triage
    return {
        "received_origin": request.headers.get("origin"),
        "host": request.headers.get("host"),
        "x_forwarded_proto": request.headers.get("x-forwarded-proto"),
        "user_agent": request.headers.get("user-agent"),
    }

# Preflight catch-all to avoid 405/404 on preflight for some clients
@app.options("/{rest_of_path:path}")
async def preflight_handler(rest_of_path: str) -> Response:
    return Response(status_code=status.HTTP_204_NO_CONTENT)

# ------------------------------------------------------------------------------
# Reference data endpoints (lightweight; great for frontend dropdowns)
# ------------------------------------------------------------------------------

@app.get("/programs")
async def list_programs(db: AsyncSession = Depends(get_db)):
    # Return a lightweight list of programs (id + name)
    # Assumes Program has fields: program_id, name (adjust if needed)
    result = await db.execute(
        Program.__table__.select().with_only_columns([Program.program_id, Program.name]).order_by(Program.name)  # type: ignore
    )
    rows = result.fetchall()
    return [{"program_id": r[0], "name": r[1]} for r in rows]

@app.get("/programs/{program_id}/requirements")
async def program_requirements(program_id: str, db: AsyncSession = Depends(get_db)):
    program = await get_program_by_program_id(db, program_id)
    if not program:
        raise HTTPException(status_code=404, detail=f"Program {program_id} not found")
    reqs = await get_program_requirements(db, program_id)
    return {"program_id": program_id, "requirements": [r.course_code for r in reqs]}

# ------------------------------------------------------------------------------
# Planning route (MVP packing with prereqs + constraints)
# ------------------------------------------------------------------------------

@app.post("/plan", response_model=PlanResponse)
async def create_plan(req: PlanRequest, db: AsyncSession = Depends(get_db)) -> PlanResponse:
    """
    MVP flow:
      1) Determine requirements set (by program_id, or fallback using major/minor mapping if you implement that later).
      2) Remove completed + do_not_take; add must_take.
      3) Build a prereq map and only schedule courses whose prereqs are met.
      4) Pack courses across N terms with credit caps, respecting per-term overrides and summer_term flag.
      5) Return stable structure (terms[] -> sections[]) for the frontend.
    """

    # 1) Identify requirement universe --------------------------
    if req.program_id:
        program = await get_program_by_program_id(db, req.program_id)
        if not program:
            raise HTTPException(status_code=404, detail=f"Program {req.program_id} not found")
        program_reqs = await get_program_requirements(db, req.program_id)
        required_codes = [r.course_code for r in program_reqs]
    else:
        # TODO: Optional: Map (major, minor) -> program_id or composite requirements.
        # For now, if program_id is missing, just start from must_take list.
        required_codes = list(set(req.must_take))

    # 2) Apply completion + preferences ------------------------
    completed = set(code.strip().upper() for code in req.completed_courses)
    do_not = set(code.strip().upper() for code in req.do_not_take)
    must_take = set(code.strip().upper() for code in req.must_take)

    required_codes = [c.strip().upper() for c in required_codes if c.strip()]
    remaining = [c for c in required_codes if c not in completed and c not in do_not]

    # Ensure must_take are included even if not in program requirements:
    for m in must_take:
        if m not in remaining and m not in completed and m not in do_not:
            remaining.append(m)

    # 3) Build prereq map + credits lookup ---------------------
    prereq_map = await get_prereq_map(db)  # { "CSC 231": ["CSC 131"], ... }
    # Load course rows so we can get titles/credits:
    courses = await get_courses_by_codes(db, remaining)
    credits_lookup = {c.code.upper(): (c.title, c.credits or 3) for c in courses}

    # 4) Pack into terms with caps ------------------------------
    terms: List[TermPlan] = []
    credit_cap_default = req.target_credits_per_term

    # Term naming helper:
    def next_term_name(n: int) -> str:
        # Simple sequence: Fall/Spring, optionally include Summer
        season_cycle = ["Fall", "Spring"] + (["Summer"] if req.summer_term else [])
        season = season_cycle[n % len(season_cycle)]
        # Start year guess (MVP). You can replace with a real starting term.
        start_year = 2026
        year = start_year + (n // len(season_cycle))
        return f"{season} {year}"

    # Greedy prereq-aware packing:
    scheduled: List[str] = []
    remaining_set = set(remaining)

    term_index = 0
    while remaining_set and len(terms) < req.terms_to_plan:
        term_name = next_term_name(term_index)
        credit_cap = req.per_term_credit_caps.get(term_name, credit_cap_default)

        term_blocks: List[SectionBlock] = []
        credits_used = 0

        # Find courses whose prereqs are satisfied by completed + scheduled
        satisfied_pool = []
        for code in list(remaining_set):
            prereqs = [p.upper() for p in prereq_map.get(code, [])]
            if all(p in completed or p in scheduled for p in prereqs):
                satisfied_pool.append(code)

        # Simple greedy fit by available credits
        for code in satisfied_pool:
            _, course_credits = credits_lookup.get(code, (None, 3))
            if credits_used + course_credits <= credit_cap:
                title, course_credits = credits_lookup.get(code, (code, course_credits))
                # NOTE: We do not have real times/sections yet; the frontend can render placeholders.
                term_blocks.append(
                    SectionBlock(
                        code=code,
                        title=title,
                        credits=course_credits,
                        days=[],
                        time=None,
                        required=(code in required_codes),
                        locked=False,
                    )
                )
                credits_used += course_credits
                scheduled.append(code)
                remaining_set.discard(code)

        terms.append(TermPlan(name=term_name, credit_cap=credit_cap, sections=term_blocks))
        term_index += 1

        # Avoid infinite loops if no course could be placed due to unmet prereqs:
        if not term_blocks:
            break

    # 5) Build response ----------------------------------------
    recs = {"certs": recommend_certs(req.career)}
    return PlanResponse(terms=terms, recommendations=recs)

# ------------------------------------------------------------------------------
# NOTES
# ------------------------------------------------------------------------------
# • Render start command (Service → Settings → Start Command):
#     uvicorn backend.main:app --host 0.0.0.0 --port $PORT --proxy-headers
# • CORS: If you change your Netlify subdomain or add Webflow preview, update ALLOWED_ORIGINS/regex.
# • When you switch frontends (App‑Gen Astro, Netlify), set the fetch URL on the client to:
#     https://uncw-planner-backend.onrender.com/plan
# • Keep /__debug__/headers and /schema.json for quick CORS/origin verification.