def create_authenticated_user(client, email):
    client.post(
        "/api/v1/auth/register",
        json={
            "name": "Workspace Tester",
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

    return login.json()["access_token"]


def test_create_workspace(client):
    token = create_authenticated_user(
        client,
        "workspace-create@example.com",
    )

    response = client.post(
        "/api/v1/workspaces",
        headers={
            "Authorization": f"Bearer {token}"
        },
        json={
            "name": "Test Workspace",
        },
    )

    assert response.status_code in (200, 201)

    data = response.json()

    assert data["name"] == "Test Workspace"
    assert "id" in data
    assert "owner_id" in data


def test_list_workspaces(client):
    token = create_authenticated_user(
        client,
        "workspace-list@example.com",
    )

    client.post(
        "/api/v1/workspaces",
        headers={
            "Authorization": f"Bearer {token}"
        },
        json={
            "name": "Workspace One",
        },
    )

    response = client.get(
        "/api/v1/workspaces",
        headers={
            "Authorization": f"Bearer {token}"
        },
    )

    assert response.status_code == 200

    data = response.json()

    assert len(data) == 1
    assert data[0]["name"] == "Workspace One"


def test_get_workspace(client):
    token = create_authenticated_user(
        client,
        "workspace-get@example.com",
    )

    created = client.post(
        "/api/v1/workspaces",
        headers={
            "Authorization": f"Bearer {token}"
        },
        json={
            "name": "Get Workspace",
        },
    )

    workspace_id = created.json()["id"]

    response = client.get(
        f"/api/v1/workspaces/{workspace_id}",
        headers={
            "Authorization": f"Bearer {token}"
        },
    )

    assert response.status_code == 200
    assert response.json()["name"] == "Get Workspace"


def test_workspace_not_found(client):
    token = create_authenticated_user(
        client,
        "workspace-not-found@example.com",
    )

    response = client.get(
        "/api/v1/workspaces/999999",
        headers={
            "Authorization": f"Bearer {token}"
        },
    )

    assert response.status_code == 404


def test_workspace_requires_authentication(client):
    response = client.post(
        "/api/v1/workspaces",
        json={
            "name": "Unauthorized Workspace",
        },
    )

    assert response.status_code == 401


def test_workspace_ownership(client):
    user_one_token = create_authenticated_user(
        client,
        "workspace-owner-one@example.com",
    )

    created = client.post(
        "/api/v1/workspaces",
        headers={
            "Authorization": f"Bearer {user_one_token}"
        },
        json={
            "name": "Private Workspace",
        },
    )

    workspace_id = created.json()["id"]

    user_two_token = create_authenticated_user(
        client,
        "workspace-owner-two@example.com",
    )

    response = client.get(
        f"/api/v1/workspaces/{workspace_id}",
        headers={
            "Authorization": f"Bearer {user_two_token}"
        },
    )

    assert response.status_code in (403, 404)