import sys
import os
import pytest

# Ensure the repository root is in Python's path so 'main' can be imported correctly
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from main import app

@pytest.fixture
def client():
    app.config["TESTING"] = True
    with app.test_client() as client:
        yield client

def test_home_page(client):
    """Verify home page loads correctly."""
    response = client.get("/")
    assert response.status_code == 200
    assert b"Home" in response.data or b"Corporate" in response.data

    response_html = client.get("/home.html")
    assert response_html.status_code == 200

def test_about_page(client):
    """Verify about us page loads correctly."""
    response = client.get("/about")
    assert response.status_code == 200
    assert b"About" in response.data

    response_html = client.get("/about.html")
    assert response_html.status_code == 200

def test_products_page(client):
    """Verify products page loads correctly."""
    response = client.get("/products")
    assert response.status_code == 200
    assert b"Product" in response.data or b"Service" in response.data

    response_html = client.get("/products.html")
    assert response_html.status_code == 200

def test_services_page(client):
    """Verify services page loads correctly."""
    response = client.get("/services")
    assert response.status_code == 200
    assert b"Service" in response.data

    response_html = client.get("/services.html")
    assert response_html.status_code == 200

def test_blog_page(client):
    """Verify blog page loads correctly."""
    response = client.get("/blog")
    assert response.status_code == 200
    assert b"Blog" in response.data

    response_html = client.get("/blog.html")
    assert response_html.status_code == 200

def test_blog_post_page(client):
    """Verify blog post detail page loads correctly."""
    response = client.get("/blog-post")
    assert response.status_code == 200
    assert b"Blog" in response.data or b"Post" in response.data

    response_html = client.get("/blog-post.html")
    assert response_html.status_code == 200

def test_contact_page(client):
    """Verify contact page loads correctly."""
    response = client.get("/contact")
    assert response.status_code == 200
    assert b"Contact" in response.data

    response_html = client.get("/contact.html")
    assert response_html.status_code == 200

def test_admin_login_page(client):
    """Verify admin login page loads correctly."""
    response = client.get("/admin-login")
    assert response.status_code == 200
    assert b"Admin" in response.data or b"Login" in response.data

    response_html = client.get("/admin-login.html")
    assert response_html.status_code == 200

def test_admin_dashboard_page(client):
    """Verify admin dashboard page loads correctly."""
    response = client.get("/admin-dashboard")
    assert response.status_code == 200
    assert b"Dashboard" in response.data or b"Admin" in response.data

    response_html = client.get("/admin-dashboard.html")
    assert response_html.status_code == 200
