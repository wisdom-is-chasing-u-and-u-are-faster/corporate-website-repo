import pytest
from datetime import date, timedelta
from fastapi.testclient import TestClient
from app.main import app
from app.database import SUBSCRIPTIONS

client = TestClient(app)

def test_get_active_subscription():
    sub_id = "7f918074-b5a8-4bb5-9e48-ec8d5e1281df"
    response = client.get(f"/v1/subscriptions/{sub_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["subscription_id"] == sub_id
    assert data["status"] == "ACTIVE"
    assert data["replenishment_frequency_days"] == 60
    assert data["discount_percentage"] == 15.00

def test_skip_subscription_cycle():
    """
    AC Scenario: Skip Next Delivery Cycle
    """
    sub_id = "7f918074-b5a8-4bb5-9e48-ec8d5e1281df"
    old_next_billing = SUBSCRIPTIONS[sub_id]["next_billing_date"]

    response = client.post(f"/v1/subscriptions/{sub_id}/skip")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "SKIPPED"
    assert data["previous_billing_date"] == old_next_billing
    # Next billing date is advanced by 60 days
    expected_next = (date.fromisoformat(old_next_billing) + timedelta(days=60)).isoformat()
    assert data["next_billing_date"] == expected_next

def test_swap_subscription_shade():
    """
    AC Scenario: Swap Foundation Shade
    """
    sub_id = "7f918074-b5a8-4bb5-9e48-ec8d5e1281df"
    new_var_id = "d9b2d63d-a233-4f16-92f7-bc6024beee18" # 300W Tan Warm Caramel

    payload = {"new_variant_id": new_var_id}
    response = client.post(f"/v1/subscriptions/{sub_id}/swap", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["variant_id"] == new_var_id
    assert "300W Tan Warm Caramel" in data["shade_name"]
    assert SUBSCRIPTIONS[sub_id]["variant_id"] == new_var_id

def test_subscription_not_found():
    response = client.get("/v1/subscriptions/non-existent-sub-id")
    assert response.status_code == 404
