from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.workspace import Workspace


def create_workspace(db: Session, owner_id: int, name: str) -> Workspace:
    workspace = Workspace(
        owner_id=owner_id,
        name=name,
    )

    db.add(workspace)
    db.commit()
    db.refresh(workspace)

    return workspace


def get_workspaces(db: Session, owner_id: int) -> list[Workspace]:
    return list(
        db.scalars(
            select(Workspace)
            .where(Workspace.owner_id == owner_id)
            .order_by(Workspace.id)
        )
    )


def get_workspace(
    db: Session,
    workspace_id: int,
    owner_id: int,
) -> Workspace | None:
    return db.scalar(
        select(Workspace).where(
            Workspace.id == workspace_id,
            Workspace.owner_id == owner_id,
        )
    )