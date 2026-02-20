# backend/crud.py
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from models import Program, ProgramRequirement, Course, CoursePrereq


async def get_program_by_program_id(db: AsyncSession, pid: str) -> Program | None:
    res = await db.execute(select(Program).where(Program.program_id == pid))
    return res.scalar_one_or_none()


async def get_program_requirements(db: AsyncSession, program_db_id: int) -> list[ProgramRequirement]:
    res = await db.execute(
        select(ProgramRequirement).where(ProgramRequirement.program_id_fk == program_db_id)
    )
    return list(res.scalars().all())


async def get_courses_by_codes(db: AsyncSession, codes: list[str]) -> list[Course]:
    if not codes:
        return []
    res = await db.execute(select(Course).where(Course.code.in_(codes)))
    return list(res.scalars().all())


async def get_prereq_map(db: AsyncSession, course_codes: list[str]) -> dict[str, set[str]]:
    """
    Return a mapping: { course_code -> set(prereq_course_code, ...) } for the given list of codes.
    Only includes entries for codes you asked for; courses without prereqs will have an empty set.
    """
    if not course_codes:
        return {}

    # 1) fetch course rows to map codes <-> ids
    courses = await get_courses_by_codes(db, course_codes)
    code_to_id = {c.code: c.id for c in courses}
    id_to_code = {c.id: c.code for c in courses}

    if not code_to_id:
        return {}

    # 2) fetch all prereq rows for these course ids
    res = await db.execute(
        select(CoursePrereq).where(CoursePrereq.course_id_fk.in_(list(id_to_code.keys())))
    )
    rows = list(res.scalars().all())

    # 3) build the mapping
    prereq_map: dict[str, set[str]] = {code: set() for code in course_codes}
    for row in rows:
        course_code = id_to_code.get(row.course_id_fk)
        if course_code:
            prereq_map.setdefault(course_code, set()).add(row.prereq_course_code)

    # ensure every requested code exists in map (even if empty)
    for code in course_codes:
        prereq_map.setdefault(code, set())

    return prereq_map