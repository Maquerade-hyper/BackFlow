def test_register_user(client):
    response = client.post(
        "/api/v1/auth/register",
        json={
            "name": "Test User",
            "email": "testuser@example.com",
            "password": "TestPassword123!",
        },
    )

    assert response.status_code in (200, 201)

    data = response.json()

    assert data["name"] == "Test User"
    assert data["email"] == "testuser@example.com"
    assert "id" in data


def test_duplicate_registration(client):
    payload = {
        "name": "Duplicate User",
        "email": "duplicate@example.com",
        "password": "TestPassword123!",
    }

    first = client.post(
        "/api/v1/auth/register",
        json=payload,
    )

    assert first.status_code in (200, 201)

    second = client.post(
        "/api/v1/auth/register",
        json=payload,
    )

    assert second.status_code == 409


def test_login(client):
    client.post(
        "/api/v1/auth/register",
        json={
            "name": "Login User",
            "email": "login@example.com",
            "password": "TestPassword123!",
        },
    )

    response = client.post(
        "/api/v1/auth/login",
        json={
            "email": "login@example.com",
            "password": "TestPassword123!",
        },
    )

    assert response.status_code == 200

    data = response.json()

    assert "access_token" in data
    assert data["token_type"] == "bearer"


def test_wrong_password(client):
    client.post(
        "/api/v1/auth/register",
        json={
            "name": "Wrong Password User",
            "email": "wrong@example.com",
            "password": "CorrectPassword123!",
        },
    )

    response = client.post(
        "/api/v1/auth/login",
        json={
            "email": "wrong@example.com",
            "password": "WrongPassword123!",
        },
    )

    assert response.status_code == 401


def test_auth_me_requires_token(client):
    response = client.get("/api/v1/auth/me")

    assert response.status_code == 401


def test_auth_me(client):
    client.post(
        "/api/v1/auth/register",
        json={
            "name": "Me User",
            "email": "me@example.com",
            "password": "TestPassword123!",
        },
    )

    login = client.post(
        "/api/v1/auth/login",
        json={
            "email": "me@example.com",
            "password": "TestPassword123!",
        },
    )

    token = login.json()["access_token"]

    response = client.get(
        "/api/v1/auth/me",
        headers={
            "Authorization": f"Bearer {token}"
        },
    )

    assert response.status_code == 200

    data = response.json()

    assert data["name"] == "Me User"
    assert data["email"] == "me@example.com"