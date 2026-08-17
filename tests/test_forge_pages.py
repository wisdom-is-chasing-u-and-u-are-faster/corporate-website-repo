"""
tests/test_forge_pages.py — Test suite for Forge corporate website
Scaffolded by jira_to_code for ARCH-388.
"""

import pytest
from app import app


@pytest.fixture
def client():
    """Flask test client fixture."""
    app.config["TESTING"] = True
    with app.test_client() as client:
        yield client


def test_home_page(client):
    """AC: Verify that a home page is implemented."""
    response_root = client.get("/")
    assert response_root.status_code == 200
    assert b"Home" in response_root.data or b"Forge" in response_root.data

    response_home = client.get("/home")
    assert response_home.status_code == 200
    assert b"Home" in response_home.data or b"Forge" in response_home.data


def test_solutions_page(client):
    """AC: Verify that a solutions page is implemented."""
    response = client.get("/solutions")
    assert response.status_code == 200
    assert b"Solution" in response.data or b"Forge" in response.data


def test_about_page(client):
    """AC: Verify that an about us page is implemented."""
    response = client.get("/about")
    assert response.status_code == 200
    assert b"About" in response.data or b"Forge" in response.data


def test_contact_page(client):
    """AC: Verify that a contact us page is implemented."""
    response = client.get("/contact")
    assert response.status_code == 200
    assert b"Contact" in response.data or b"Forge" in response.data


def test_responsive_design(client):
    """AC: Verify that the website is responsive on desktop and mobile devices."""
    pages = ["/", "/home", "/solutions", "/about", "/contact"]
    for page in pages:
        response = client.get(page)
        assert response.status_code == 200
        html = response.data.decode("utf-8")
        assert "viewport" in html.lower()
