import pytest
import uuid
from fastapi.testclient import TestClient
from app.main import app
from app.database import RESERVATIONS, ORDERS, OUTBOX_EVENTS

client = TestClient(app)

def test_checkout_order_saga_success():
    """
    AC Scenario: Successful Order Checkout Saga & Outbox Event Emission
    """
    # 1. First make a reservation
    v_id = "d9b2d63d-a233-4f16-92f7-bc6024beee15"
    res_payload = {
        "customer_session_id": str(uuid.uuid4()),
        "items": [{"variant_id": v_id, "quantity": 1}]
    }
    res_res = client.post("/v1/cart/reserve", json=res_payload)
    assert res_res.status_code == 201
    res_id = res_res.json()["reservation_id"]

    # 2. Checkout order
    checkout_payload = {
        "reservation_id": res_id,
        "payment_token": "pm_card_visa_tok_live_001924",
        "shipping_address": {
            "street_1": "123 Fifth Ave",
            "city": "New York",
            "state_province": "NY",
            "postal_code": "10001",
            "country_iso2": "US"
        },
        "is_subscription_order": False
    }
    idemp_key = str(uuid.uuid4())
    headers = {"Idempotency-Key": idemp_key}

    checkout_res = client.post("/v1/orders/checkout", json=checkout_payload, headers=headers)
    assert checkout_res.status_code == 200
    order_data = checkout_res.json()
    assert order_data["status"] == "CONFIRMED"
    assert "ORD-" in order_data["order_number"]
    assert order_data["total_amount"] == 48.00

    # 3. Check outbox event emission
    assert len(OUTBOX_EVENTS) > 0
    latest_outbox = OUTBOX_EVENTS[-1]
    assert latest_outbox["event_type"] == "OrderConfirmedEvent"
    assert latest_outbox["aggregate_id"] == order_data["order_id"]

    # 4. Check Idempotency deduplication
    dup_res = client.post("/v1/orders/checkout", json=checkout_payload, headers=headers)
    assert dup_res.status_code == 200
    assert dup_res.json()["order_id"] == order_data["order_id"]

def test_checkout_invalid_reservation_not_found():
    checkout_payload = {
        "reservation_id": str(uuid.uuid4()),
        "payment_token": "pm_card_visa_tok_live_001924",
        "shipping_address": {
            "street_1": "123 Fifth Ave",
            "city": "New York",
            "state_province": "NY",
            "postal_code": "10001",
            "country_iso2": "US"
        }
    }
    response = client.post("/v1/orders/checkout", json=checkout_payload)
    assert response.status_code == 404
