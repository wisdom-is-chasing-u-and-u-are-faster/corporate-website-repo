import pytest
import uuid
from fastapi.testclient import TestClient
from app.main import app
from app.database import INVENTORY, VARIANTS

client = TestClient(app)

def test_atomic_cart_reservation_success():
    """
    AC Scenario: Successful 10-Minute Atomic Cart Reservation
    """
    v_id = "d9b2d63d-a233-4f16-92f7-bc6024beee01"
    initial_avail = INVENTORY[v_id]["available"]

    payload = {
        "customer_session_id": str(uuid.uuid4()),
        "items": [
            {
                "variant_id": v_id,
                "quantity": 2
            }
        ]
    }
    idempotency_key = str(uuid.uuid4())
    headers = {"Idempotency-Key": idempotency_key}

    response = client.post("/v1/cart/reserve", json=payload, headers=headers)
    assert response.status_code == 201
    data = response.json()
    assert data["status"] == "RESERVED"
    assert data["ttl_seconds"] == 600
    assert "expires_at" in data
    assert len(data["items"]) == 1

    # Verify atomic inventory decrement
    assert INVENTORY[v_id]["available"] == initial_avail - 2

    # Verify idempotency key deduplication
    dup_res = client.post("/v1/cart/reserve", json=payload, headers=headers)
    assert dup_res.status_code == 201
    assert dup_res.json()["reservation_id"] == data["reservation_id"]
    # Available stock should NOT decrement again
    assert INVENTORY[v_id]["available"] == initial_avail - 2

def test_reservation_insufficient_stock_error():
    v_id = "d9b2d63d-a233-4f16-92f7-bc6024beee02"
    # Temporarily set available stock to 0
    old_stock = INVENTORY[v_id]["available"]
    INVENTORY[v_id]["available"] = 0

    payload = {
        "customer_session_id": str(uuid.uuid4()),
        "items": [
            {
                "variant_id": v_id,
                "quantity": 1
            }
        ]
    }
    response = client.post("/v1/cart/reserve", json=payload)
    assert response.status_code == 409
    assert "Insufficient inventory" in response.json()["detail"]

    # Restore stock
    INVENTORY[v_id]["available"] = old_stock

def test_discontinued_shade_rejection():
    # Attempting to reserve discontinued variant
    disc_id = "d9b2d63d-a233-4f16-92f7-bc6024beee28"
    payload = {
        "customer_session_id": str(uuid.uuid4()),
        "items": [
            {
                "variant_id": disc_id,
                "quantity": 1
            }
        ]
    }
    response = client.post("/v1/cart/reserve", json=payload)
    assert response.status_code == 400
