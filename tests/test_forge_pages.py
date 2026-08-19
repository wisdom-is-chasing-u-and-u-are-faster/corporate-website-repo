"""
Unit and integration tests for Forge corporate website pages.
Verifies acceptance criteria for Jira ticket ARCH-388.
"""
import os
from typing import Generator
import pytest
from flask.testing import FlaskClient
from app import app


@pytest.fixture
def client() -> Generator[FlaskClient, None, None]:
    """Test client fixture for Flask app."""
    os.environ["TESTING"] = "true"
    app.testing = True
    with app.test_client() as test_client:
        yield test_client


def test_home_page_implemented(client: FlaskClient) -> None:
    """
    AC: Verify that a home page is implemented.
    Verifies that GET /home returns 200 and contains core Home page content.
    """
    response = client.get("/home")
    assert response.status_code == 200
    html = response.get_data(as_text=True)
    assert len(html) > 0
    assert "Home" in html or "forge" in html.lower()


def test_root_route_serves_home_page(client: FlaskClient) -> None:
    """
    AC: Verify that a home page is implemented.
    Verifies that GET / serves the Home page with HTTP 200.
    """
    response = client.get("/")
    assert response.status_code == 200
    html = response.get_data(as_text=True)
    assert len(html) > 0


def test_solutions_page_implemented(client: FlaskClient) -> None:
    """
    AC: Verify that a solutions page is implemented.
    Verifies that GET /solutions returns 200 and contains Solutions content.
    """
    response = client.get("/solutions")
    assert response.status_code == 200
    html = response.get_data(as_text=True)
    assert len(html) > 0
    assert "Solutions" in html or "solutions" in html.lower()


def test_about_us_page_implemented(client: FlaskClient) -> None:
    """
    AC: Verify that an about us page is implemented.
    Verifies that GET /about returns 200 and contains About Us content.
    """
    response = client.get("/about")
    assert response.status_code == 200
    html = response.get_data(as_text=True)
    assert len(html) > 0
    assert "About" in html or "about" in html.lower()


def test_contact_us_page_implemented(client: FlaskClient) -> None:
    """
    AC: Verify that a contact us page is implemented.
    Verifies that GET /contact returns 200 and contains Contact Us content.
    """
    response = client.get("/contact")
    assert response.status_code == 200
    html = response.get_data(as_text=True)
    assert len(html) > 0
    assert "Contact" in html or "contact" in html.lower()


def test_website_responsive_design_metadata(client: FlaskClient) -> None:
    """
    AC: Verify that the website is responsive on desktop and mobile devices.
    Verifies that all pages include standard responsive viewport meta tags.
    """
    endpoints = ["/", "/home", "/solutions", "/about", "/contact"]
    for endpoint in endpoints:
        response = client.get(endpoint)
        assert response.status_code == 200
        html = response.get_data(as_text=True)
        assert 'name="viewport"' in html
        assert "width=device-width" in html


def test_health_check_endpoint(client: FlaskClient) -> None:
    """Verifies that the /health monitoring endpoint returns 200 OK."""
    response = client.get("/health")
    assert response.status_code == 200
    assert response.get_data(as_text=True) == "OK"
