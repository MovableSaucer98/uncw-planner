# backend/models.py
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship
from sqlalchemy import String, Integer, ForeignKey, Text, UniqueConstraint

class Base(DeclarativeBase):
    pass

class Program(Base):
    __tablename__ = "programs"
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    program_id: Mapped[str] = mapped_column(String(64), unique=True, index=True)  # e.g., "BS-CS-2025"
    name: Mapped[str] = mapped_column(String(255))
    total_credits: Mapped[int] = mapped_column(Integer)

    requirements: Mapped[list["ProgramRequirement"]] = relationship(back_populates="program")

class Course(Base):
    __tablename__ = "courses"
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    code: Mapped[str] = mapped_column(String(32), unique=True, index=True)  # e.g., "CSC 231"
    title: Mapped[str] = mapped_column(String(255))
    credits: Mapped[int] = mapped_column(Integer)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)

    prereqs: Mapped[list["CoursePrereq"]] = relationship(back_populates="course")

class ProgramRequirement(Base):
    __tablename__ = "program_requirements"
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    program_id_fk: Mapped[int] = mapped_column(ForeignKey("programs.id"))
    course_code: Mapped[str] = mapped_column(String(32))
    kind: Mapped[str] = mapped_column(String(32))  # 'core' | 'elective'

    program = relationship("Program", back_populates="requirements")
    __table_args__ = (UniqueConstraint("program_id_fk", "course_code", name="uq_prog_course"),)

class CoursePrereq(Base):
    __tablename__ = "course_prereqs"
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    course_id_fk: Mapped[int] = mapped_column(ForeignKey("courses.id"))
    prereq_course_code: Mapped[str] = mapped_column(String(32))

    course = relationship("Course", back_populates="prereqs")

class TermOffering(Base):
    __tablename__ = "term_offerings"
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    course_code: Mapped[str] = mapped_column(String(32))
    term: Mapped[str] = mapped_column(String(16))  # e.g., "2026FA", "2027SP"