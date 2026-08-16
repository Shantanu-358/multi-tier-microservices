import pytest

def test_full_end_to_end_multitier_flow(client):
    """
    End-to-End multi-tier workflow integration test.
    Simulates gateway request flow through authentication, product catalog,
    order submission, and database persistence.
    """
    # 1. Health Probe Verification
    health_res = client.get("/health")
    assert health_res.status_code == 200
    assert health_res.json()["status"] == "healthy"

    v1_health_res = client.get("/api/v1/health")
    assert v1_health_res.status_code == 200
    assert v1_health_res.json()["status"] == "healthy"

    # 2. User Registration & JWT Token Issuance
    user_data = {
        "email": "e2e_user@microservices.local",
        "password": "e2e_password_123"
    }
    reg_res = client.post("/api/v1/auth/register", json=user_data)
    assert reg_res.status_code == 201
    reg_json = reg_res.json()
    assert "access_token" in reg_json
    token = reg_json["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # 3. User Authentication Login Verification
    login_res = client.post("/api/v1/auth/login", json=user_data)
    assert login_res.status_code == 200
    assert "access_token" in login_res.json()

    # 4. Product Catalog Fetching
    get_products_res = client.get("/api/v1/products")
    assert get_products_res.status_code == 200
    initial_products = get_products_res.json()
    assert isinstance(initial_products, list)

    # 5. Product Creation (Protected Route)
    new_product_payload = {
        "name": "E2E Redis Cache Node",
        "description": "High throughput in-memory cache microservice",
        "price": 34.99
    }
    create_product_res = client.post("/api/v1/products", json=new_product_payload, headers=headers)
    assert create_product_res.status_code == 201
    created_product = create_product_res.json()
    assert created_product["name"] == "E2E Redis Cache Node"
    assert created_product["price"] == 34.99

    # 6. Order Placement & Database Persistence (Protected Route)
    order_payload = {
        "total_amount": 69.98,
        "status": "completed"
    }
    create_order_res = client.post("/api/v1/orders", json=order_payload, headers=headers)
    assert create_order_res.status_code == 201
    order = create_order_res.json()
    assert order["user_id"] == reg_json["user"]["id"]
    assert order["total_amount"] == 69.98
    assert order["status"] == "completed"

    # 7. User Specific Order Query
    get_orders_res = client.get("/api/v1/orders", headers=headers)
    assert get_orders_res.status_code == 200
    user_orders = get_orders_res.json()
    assert len(user_orders) == 1
    assert user_orders[0]["id"] == order["id"]
