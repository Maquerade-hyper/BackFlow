from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.project import Project
from app.models.workspace import Workspace


def create_project(
    db: Session,
    workspace_id: int,
    owner_id: int,
    name: str,
    description: str | None,
) -> Project:
    workspace = db.scalar(
        select(Workspace).where(
            Workspace.id == workspace_id,
            Workspace.owner_id == owner_id,
        )
    )

    if not workspace:
        raise ValueError("Workspace not found")

    project = Project(
        workspace_id=workspace_id,
        name=name,
        description=description,
    )

    db.add(project)
    db.commit()
    db.refresh(project)

    return project


def get_projects(
    db: Session,
    workspace_id: int,
    owner_id: int,
) -> list[Project]:
    workspace = db.scalar(
        select(Workspace).where(
            Workspace.id == workspace_id,
            Workspace.owner_id == owner_id,
        )
    )

    if not workspace:
        raise ValueError("Workspace not found")

    return list(
        db.scalars(
            select(Project)
            .where(Project.workspace_id == workspace_id)
            .order_by(Project.id)
        )
    )


def get_project(
    db: Session,
    project_id: int,
    owner_id: int,
) -> Project | None:
    return db.scalar(
        select(Project)
        .join(Workspace, Project.workspace_id == Workspace.id)
        .where(
            Project.id == project_id,
            Workspace.owner_id == owner_id,
        )
    )