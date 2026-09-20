from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.dependencies import get_current_user, get_db
from app.models.user import User
from app.schemas.project import ProjectCreate, ProjectResponse
from app.services.project import (
    create_project,
    get_project,
    get_projects,
)

router = APIRouter(prefix="/projects", tags=["Projects"])


@router.post(
    "/workspaces/{workspace_id}",
    response_model=ProjectResponse,
    status_code=status.HTTP_201_CREATED,
)
def create(
    workspace_id: int,
    request: ProjectCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    try:
        return create_project(
            db=db,
            workspace_id=workspace_id,
            owner_id=current_user.id,
            name=request.name,
            description=request.description,
        )
    except ValueError as exc:
        raise HTTPException(status_code=404, detail=str(exc))


@router.get(
    "/workspaces/{workspace_id}",
    response_model=list[ProjectResponse],
)
def list_all(
    workspace_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    try:
        return get_projects(
            db=db,
            workspace_id=workspace_id,
            owner_id=current_user.id,
        )
    except ValueError as exc:
        raise HTTPException(status_code=404, detail=str(exc))


@router.get(
    "/{project_id}",
    response_model=ProjectResponse,
)
def get_one(
    project_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    project = get_project(
        db=db,
        project_id=project_id,
        owner_id=current_user.id,
    )

    if not project:
        raise HTTPException(
            status_code=404,
            detail="Project not found",
        )

    return project