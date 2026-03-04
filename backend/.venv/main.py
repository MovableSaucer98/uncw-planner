#backend/main.py
from fastapi import FastAPI 
from pydantic import BaseModel
from typing import List, Optional

app = FastAPI(title="UNCW Planner API (MVP)")

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
def create_plan(req: PlanRequest):
    pretend_remaining = [ 
        "ENG 201","CSC 231","CSC 331","CSC 340","CSC 350",
        "MAT 162","STT 215","CSC 432","CSC 442","CSC 450",
        "HUM 210","SCI 110","CSC 220","CSC 240","CSC 300",
        "CSC 310","CSC 320","CSC 360","CSC 370","CSC 380"
    ]

    remaining = [c for c in pretend_remaining if c not in req.completed_courses]

    plan = []
    i=0
    for t in range(req.terms_to_plan):
        term_list = []
        credits = 0
        while i < len(remaining) and credits + 3 <= req.target_credits_per_term:
            term_list.append({"course_id": remaining[i], "offer_probability": 0.7, "risk": "medium"})
            credits += 3
            i += 1
        plan.append({"term_index": t+1, "planned_courses": term_list, "credits": credits})

    return {"plan": plan}
