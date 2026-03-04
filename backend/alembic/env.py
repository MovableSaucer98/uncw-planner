# backend/alembic/env.py
import os
import asyncio
from logging.config import fileConfig
from typing import Optional

from alembic import context
from sqlalchemy import pool
from sqlalchemy.engine import Connection
from sqlalchemy.ext.asyncio import async_engine_from_config

# If you keep a local .env for DATABASE_URL (EXTERNAL), load it when running locally.
try:
    from dotenv import load_dotenv  # optional (only if installed)
    load_dotenv()
except Exception:
    pass

# This is the Alembic Config object, which provides access to the .ini values.
config = context.config

# Set up Python logging using alembic.ini.
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# --- Point Alembic to your models' metadata so `--autogenerate` works ---
# IMPORTANT: This import assumes you run Alembic from the backend folder.
# i.e., your current working directory is ~/projects/uncw-planner/backend
from models import Base  # <-- your SQLAlchemy models are in backend/models.py
target_metadata = Base.metadata


def _normalize_to_asyncpg(url: str) -> str:
    """
    Ensure the URL uses SQLAlchemy's async dialect prefix.
    e.g., postgres://... -> postgresql+asyncpg://...
    If it's already using postgresql+asyncpg://, leave it alone.
    """
    if url.startswith("postgresql+asyncpg://"):
        return url
    if url.startswith("postgres://"):
        return url.replace("postgres://", "postgresql+asyncpg://", 1)
    if url.startswith("postgresql://"):
        return url.replace("postgresql://", "postgresql+asyncpg://", 1)
    return url


def get_url() -> str:
    """
    Determine the DB URL for migrations:
      1) Prefer the DATABASE_URL environment variable if set (from .env or CI),
      2) Otherwise, fall back to alembic.ini's sqlalchemy.url.
    Always normalize to the asyncpg dialect.
    """
    env_url: Optional[str] = os.getenv("DATABASE_URL")
    if env_url:
        return _normalize_to_asyncpg(env_url)

    ini_url = config.get_main_option("sqlalchemy.url")
    if not ini_url:
        raise RuntimeError(
            "No sqlalchemy.url found and DATABASE_URL not set. "
            "Set DATABASE_URL env var or edit backend/alembic.ini"
        )
    return _normalize_to_asyncpg(ini_url)


def run_migrations_offline() -> None:
    """
    Run migrations in 'offline' mode.
    This configures the context with just a URL (no Engine).
    """
    url = get_url()
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
        compare_type=True,       # also detect column type changes
        compare_server_default=True,
    )

    with context.begin_transaction():
        context.run_migrations()


def do_run_migrations(connection: Connection) -> None:
    """
    Run migrations in 'online' mode given a live connection.
    """
    context.configure(
        connection=connection,
        target_metadata=target_metadata,
        compare_type=True,
        compare_server_default=True,
    )

    with context.begin_transaction():
        context.run_migrations()


async def run_async_migrations() -> None:
    """
    Create an async Engine and run migrations in 'online' mode.
    """
    # Start with values from alembic.ini and override the URL with get_url()
    ini_section = config.get_section(config.config_ini_section) or {}
    ini_section = dict(ini_section)  # make a copy we can modify
    ini_section["sqlalchemy.url"] = get_url()

    connectable = async_engine_from_config(
        ini_section,
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    async with connectable.connect() as connection:
        await connection.run_sync(do_run_migrations)
    await connectable.dispose()


def run_migrations_online() -> None:
    asyncio.run(run_async_migrations())


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()