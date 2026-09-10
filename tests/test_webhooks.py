import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_stripe_webhook_processing_success():
    payload = {
        "id": "evt_test_webhook_001",
        "type": "payment_intent.succeeded",
        "data": {
            "object": {
                "id": "pi_test_payment_intent_12345",
                "amount": 4800,
                "currency": "usd",
                "status": "succeeded"
            }
        }
    }
    response = client.post("/v1/payments/webhook", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["received"] is True
    assert data["event_id"] == "evt_test_webhook_001"

def test_stripe_webhook_invalid_signature_error():
    payload = {
        "id": "evt_test_invalid",
        "type": "payment_intent.failed",
        "data": {}
    }
    headers = {"Stripe-Signature": "invalid_sig"}
    response = client.post("/v1/payments/webhook", json=payload, headers=headers)
    assert response.status_code == 400
