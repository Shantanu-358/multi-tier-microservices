def test_user_registration_and_login(client):
    user_payload = {
        "email": "newuser@example.com",
        "password": "securepassword123"
    }

    # 1. Register User
    reg_response = client.post("/api/v1/auth/register", json=user_payload)
    assert reg_response.status_code == 201
    reg_data = reg_response.json()
    assert "access_token" in reg_data
    assert reg_data["user"]["email"] == "newuser@example.com"

    # 2. Duplicate Registration Rejection
    dup_response = client.post("/api/v1/auth/register", json=user_payload)
    assert dup_response.status_code == 400
    assert "already exists" in dup_response.json()["detail"]

    # 3. Successful Login
    login_response = client.post("/api/v1/auth/login", json=user_payload)
    assert login_response.status_code == 200
    login_data = login_response.json()
    assert "access_token" in login_data
    assert login_data["user"]["email"] == "newuser@example.com"

    # 4. Invalid Password Login
    bad_login_response = client.post("/api/v1/auth/login", json={
        "email": "newuser@example.com",
        "password": "wrongpassword"
    })
    assert bad_login_response.status_code == 401
