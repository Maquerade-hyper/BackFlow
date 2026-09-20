import os

# ============================================================
# Test database
# ============================================================

os.environ["DATABASE_URL"] = (
    "postgresql+psycopg2://"
    "backflow:backflow_dev@localhost:5434/backflow_test"
)


# ============================================================
# Application imports
# ============================================================

from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.main import app
from app.db.base import Base
from app.api.dependencies import get_db

# Register all SQLAlchemy models
from app.models.user import User
from app.models.workspace import Workspace
from app.models.project import Project


# ============================================================
# Test database
# ============================================================

TEST_DATABASE_URL = os.environ["DATABASE_URL"]

engine = create_engine(
    TEST_DATABASE_URL,
    pool_pre_ping=True,
)

TestingSessionLocal = sessionmaker(
    bind=engine,
    autoflush=False,
    autocommit=False,
)


# ============================================================
# Database dependency override
# ============================================================

def override_get_db():
    db = TestingSessionLocal()

    try:
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db


# ============================================================
# Database lifecycle
# ============================================================

import pytest


@pytest.fixture(scope="session", autouse=True)
def setup_database():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)

    yield

    Base.metadata.drop_all(bind=engine)


# ============================================================
# FastAPI test client
# ============================================================

@pytest.fixture
def client():
    with TestClient(app) as test_client:
        yield test_client