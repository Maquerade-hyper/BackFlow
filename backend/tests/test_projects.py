def create_user_and_workspace(client, email):
    client.post(
        "/api/v1/auth/register",
        json={
            "name": "Project Tester",
            "email": email,
            "password": "TestPassword123!",
        },
    )

    login = client.post(
        "/api/v1/auth/login",
        json={
            "email": email,
            "password": "TestPassword123!",
        },
    )

    token = login.json()["access_token"]

    workspace = client.post(
        "/api/v1/workspaces",
        headers={
            "Authorization": f"Bearer {token}"
        },
        json={
            "name": "Project Workspace",
        },
    )

    workspace_id = workspace.json()["id"]

    return token, workspace_id


def test_create_project(client):
    token, workspace_id = create_user_and_workspace(
        client,
        "project-create@example.com",
    )

    response = client.post(
        f"/api/v1/projects/workspaces/{workspace_id}",
        headers={
            "Authorization": f"Bearer {token}"
        },
        json={
            "name": "Test Project",
            "description": "Project testing.",
        },
    )

    assert response.status_code in (200, 201)

    data = response.json()

    assert data["name"] == "Test Project"
    assert data["workspace_id"] == workspace_id
    assert data["description"] == "Project testing."


def test_list_projects(client):
    token, workspace_id = create_user_and_workspace(
        client,
        "project-list@example.com",
    )

    client.post(
        f"/api/v1/projects/workspaces/{workspace_id}",
        headers={
            "Authorization": f"Bearer {token}"
        },
        json={
            "name": "Project One",
            "description": "First project.",
        },
    )

    response = client.get(
        f"/api/v1/projects/workspaces/{workspace_id}",
        headers={
            "Authorization": f"Bearer {token}"
        },
    )

    assert response.status_code == 200

    data = response.json()

    assert len(data) == 1
    assert data[0]["name"] == "Project One"


def test_get_project(client):
    token, workspace_id = create_user_and_workspace(
        client,
        "project-get@example.com",
    )

    created = client.post(
        f"/api/v1/projects/workspaces/{workspace_id}",
        headers={
            "Authorization": f"Bearer {token}"
        },
        json={
            "name": "Get Project",
            "description": "Testing get.",
        },
    )

    project_id = created.json()["id"]

    response = client.get(
        f"/api/v1/projects/{project_id}",
        headers={
            "Authorization": f"Bearer {token}"
        },
    )

    assert response.status_code == 200
    assert response.json()["name"] == "Get Project"


def test_project_not_found(client):
    token, _ = create_user_and_workspace(
        client,
        "project-not-found@example.com",
    )

    response = client.get(
        "/api/v1/projects/999999",
        headers={
            "Authorization": f"Bearer {token}"
        },
    )

    assert response.status_code == 404


def test_project_requires_authentication(client):
    response = client.get(
        "/api/v1/projects/workspaces/1"
    )

    assert response.status_code == 401


def test_project_invalid_workspace(client):
    token, _ = create_user_and_workspace(
        client,
        "project-invalid-workspace@example.com",
    )

    response = client.post(
        "/api/v1/projects/workspaces/999999",
        headers={
            "Authorization": f"Bearer {token}"
        },
        json={
            "name": "Invalid Project",
            "description": "Should fail.",
        },
    )

    assert response.status_code == 404


def test_project_ownership(client):
    owner_token, workspace_id = (
        create_user_and_workspace(
            client,
            "project-owner-one@example.com",
        )
    )

    created = client.post(
        f"/api/v1/projects/workspaces/{workspace_id}",
        headers={
            "Authorization": f"Bearer {owner_token}"
        },
        json={
            "name": "Private Project",
            "description": "Private.",
        },
    )

    project_id = created.json()["id"]

    other_token, _ = create_user_and_workspace(
        client,
        "project-owner-two@example.com",
    )

    response = client.get(
        f"/api/v1/projects/{project_id}",
        headers={
            "Authorization": f"Bearer {other_token}"
        },
    )

    assert response.status_code in (403, 404)