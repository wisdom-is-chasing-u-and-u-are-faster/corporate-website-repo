import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.color_matcher import calculate_delta_e, calculate_match_confidence

client = TestClient(app)

def test_delta_e_accuracy():
    # Exact match Delta-E should be 0
    d_e_same = calculate_delta_e("#fae7d0", "#fae7d0")
    assert d_e_same == 0.0

    # Very close shades should have low Delta-E
    d_e_close = calculate_delta_e("#fae7d0", "#f9e4d4")
    assert d_e_close < 5.0

    # Distant shades (fair vs deep) should have high Delta-E
    d_e_distant = calculate_delta_e("#fae7d0", "#381c13")
    assert d_e_distant > 40.0

def test_successful_shade_matching_gherkin():
    """
    AC Scenario: Successful faceted shade matching by hex code and undertone
    Given a customer provides hex code '#fae7d0', undertone 'WARM', and finish 'DEWY'
    When the customer submits a POST request to '/v1/catalog/shades/match'
    Then the response status must be HTTP 200 OK
    And the payload must return variant 'AL-FDN-100W' with match confidence > 95%
    """
    payload = {
        "shade_hex_code": "#fae7d0",
        "undertone": "WARM",
        "finish_type": "DEWY"
    }
    response = client.post("/v1/catalog/shades/match", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "matched_variants" in data
    assert len(data["matched_variants"]) > 0

    top_match = data["matched_variants"][0]
    assert top_match["sku"] == "AL-FDN-100W"
    assert top_match["match_confidence_percentage"] >= 95.0
    assert top_match["in_stock"] is True
    assert top_match["retail_price"] == 48.00

def test_invalid_hex_color_validation_gherkin():
    """
    AC Scenario: Invalid hex color code validation
    Given a customer submits an invalid hex code '#ZZ9999'
    When the request is processed by the catalog service
    Then the response status must be HTTP 422/400 with validation failure
    """
    payload = {
        "shade_hex_code": "#ZZ9999",
        "undertone": "WARM",
        "finish_type": "DEWY"
    }
    response = client.post("/v1/catalog/shades/match", json=payload)
    assert response.status_code in [400, 422]

def test_get_product_by_slug():
    response = client.get("/v1/catalog/products/luminous-radiance-serum-foundation")
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == "Luminous Radiance Serum Foundation"
    assert len(data["variants"]) >= 20

def test_get_product_not_found():
    response = client.get("/v1/catalog/products/non-existent-slug")
    assert response.status_code == 404

def test_list_variants_with_filters():
    response = client.get("/v1/catalog/variants?undertone=OLIVE")
    assert response.status_code == 200
    data = response.json()
    assert data["total"] > 0
    for v in data["variants"]:
        assert v["shade_undertone"] == "OLIVE"
