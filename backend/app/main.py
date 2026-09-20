from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.auth import router as auth_router
from app.api.workspaces import router as workspace_router
from app.api.projects import router as project_router
from app.core.config import settings


# ============================================================
# BackFlow API
# ============================================================

app = FastAPI(
    title=settings.app_name,
    description="BackFlow application engineering platform API",
    version=settings.app_version,
)


# ============================================================
# CORS
# ============================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================
# Health
# ============================================================

@app.get(
    "/health",
    tags=["System"],
)
def health_check():
    return {
        "status": "ok",
        "service": "backflow-api",
        "version": settings.app_version,
        "environment": settings.environment,
    }


# ============================================================
# API Routers
# ============================================================

app.include_router(
    auth_router,
    prefix="/api/v1",
    tags=["Authentication"],
)

app.include_router(
    workspace_router,
    prefix="/api/v1",
    tags=["Workspaces"],
)

app.include_router(
    project_router,
    prefix="/api/v1",
    tags=["Projects"],
)