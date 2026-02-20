# backend/crud.py
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from models import Program, ProgramRequirement, Course

async def get_program_by_program_id(db: AsyncSession, pid: str) -> Program | None:
    res = await db.execute(select(Program).where(Program.program_id == pid))
    return res.scalar_one_or_none()

async def get_program_requirements(db: AsyncSession, program_db_id: int) -> list[ProgramRequirement]:
    res = await db.execute(select(ProgramRequirement).where(ProgramRequirement.program_id_fk == program_db_id))
    return list(res.scalars().all())

async def get_courses_by_codes(db: AsyncSession, codes: list[str]) -> list[Course]:
    if not codes:
        return []
    res = await db.execute(select(Course).where(Course.code.in_(codes)))
    return list(res.scalars().all())