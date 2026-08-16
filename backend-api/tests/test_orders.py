def test_orders_flow(client):
    # 1. Unauthenticated orders access should fail (401/403)
    unauth_get = client.get("/api/v1/orders")
    assert unauth_get.status_code == 403 or unauth_get.status_code == 401

    # 2. Register User A
    user_a_res = client.post("/api/v1/auth/register", json={
        "email": "usera@example.com",
        "password": "usera_password"
    })
    token_a = user_a_res.json()["access_token"]
    headers_a = {"Authorization": f"Bearer {token_a}"}

    # 3. Create Order for User A
    order_payload = {"total_amount": 149.99, "status": "pending"}
    create_order_res = client.post("/api/v1/orders", json=order_payload, headers=headers_a)
    assert create_order_res.status_code == 201
    order_data = create_order_res.json()
    assert order_data["total_amount"] == 149.99
    assert order_data["status"] == "pending"

    # 4. Get User A orders
    get_orders_a = client.get("/api/v1/orders", headers=headers_a)
    assert get_orders_a.status_code == 200
    orders_a = get_orders_a.json()
    assert len(orders_a) == 1
    assert orders_a[0]["total_amount"] == 149.99

    # 5. Register User B and verify they see 0 orders
    user_b_res = client.post("/api/v1/auth/register", json={
        "email": "userb@example.com",
        "password": "userb_password"
    })
    token_b = user_b_res.json()["access_token"]
    headers_b = {"Authorization": f"Bearer {token_b}"}

    get_orders_b = client.get("/api/v1/orders", headers=headers_b)
    assert get_orders_b.status_code == 200
    assert len(get_orders_b.json()) == 0
