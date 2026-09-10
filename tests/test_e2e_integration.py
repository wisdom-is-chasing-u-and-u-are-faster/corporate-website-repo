import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health_endpoint():
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "HEALTHY"
    assert data["service"] == "d2c-cosmetic-platform"

def test_frontend_root_serves_html():
    response = client.get("/")
    assert response.status_code == 200
    assert "<!DOCTYPE html>" in response.text
    assert "AURA LUXE" in response.text

def test_frontend_shade_finder_serves_html():
    response = client.get("/shade-finder.html")
    assert response.status_code == 200
    assert "50-Shade Precision Complexion Matrix" in response.text

def test_frontend_pdp_serves_html():
    response = client.get("/pdp.html")
    assert response.status_code == 200
    assert "Luminous Radiance Serum Foundation" in response.text

def test_frontend_cart_serves_html():
    response = client.get("/cart.html")
    assert response.status_code == 200
    assert "Your Reserved Cart" in response.text

def test_frontend_checkout_serves_html():
    response = client.get("/checkout.html")
    assert response.status_code == 200
    assert "Tokenized Checkout" in response.text

def test_frontend_subscriptions_serves_html():
    response = client.get("/subscriptions.html")
    assert response.status_code == 200
    assert "My Complexion Subscriptions" in response.text

def test_frontend_client_api_served():
    response = client.get("/js/api.js")
    assert response.status_code == 200
    assert "window.API = API" in response.text
