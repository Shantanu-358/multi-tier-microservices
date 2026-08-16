def test_products_flow(client):
    # 1. Public list products (initially empty)
    list_response = client.get("/api/v1/products")
    assert list_response.status_code == 200
    assert list_response.json() == []

    # 2. Try creating product without authentication (should be 401/403)
    product_payload = {
        "name": "Super Server",
        "description": "Powerful server instance",
        "price": 99.99
    }
    unauth_response = client.post("/api/v1/products", json=product_payload)
    assert unauth_response.status_code == 403 or unauth_response.status_code == 401

    # 3. Register user & get JWT token
    reg_response = client.post("/api/v1/auth/register", json={
        "email": "admin@example.com",
        "password": "adminpassword"
    })
    token = reg_response.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # 4. Create product with valid token
    create_response = client.post("/api/v1/products", json=product_payload, headers=headers)
    assert create_response.status_code == 201
    created_product = create_response.json()
    assert created_product["name"] == "Super Server"
    assert created_product["price"] == 99.99

    # 5. List products again
    list_again_response = client.get("/api/v1/products")
    assert list_again_response.status_code == 200
    products = list_again_response.json()
    assert len(products) == 1
    assert products[0]["name"] == "Super Server"
