import pytest
from app import app


@pytest.fixture
def client():
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client


def test_home_page(client):
    """Test that the home page loads successfully."""
    response = client.get('/')
    assert response.status_code == 200
    assert b"Welcome to Our Corporate Website" in response.data


def test_about_page(client):
    """Test that the about page loads successfully."""
    response = client.get('/about')
    assert response.status_code == 200
    assert b"About Us" in response.data


def test_products_page(client):
    """Test that the products page loads successfully."""
    response = client.get('/products')
    assert response.status_code == 200
    assert b"Our Products" in response.data


def test_services_page(client):
    """Test that the services page loads successfully."""
    response = client.get('/services')
    assert response.status_code == 200
    assert b"Our Services" in response.data


def test_contact_page_get(client):
    """Test that the contact page loads successfully on GET."""
    response = client.get('/contact')
    assert response.status_code == 200
    assert b"Contact Us" in response.data


def test_contact_page_post(client):
    """Test that the contact page handles POST requests."""
    response = client.post('/contact', data={
        'name': 'Test User',
        'email': 'test@example.com',
        'message': 'Hello!'
    }, follow_redirects=True)
    assert response.status_code == 200
    assert b"Thank you for your message" in response.data


def test_admin_login_page(client):
    """Test that the admin login page loads."""
    response = client.get('/admin/login')
    assert response.status_code == 200
    assert b"Admin Login" in response.data


def test_admin_dashboard_unauthenticated(client):
    """Test that unauthenticated users are redirected from the dashboard."""
    response = client.get('/admin/dashboard', follow_redirects=True)
    assert response.status_code == 200
    # Should be redirected to login page
    assert b"Please log in to access the dashboard" in response.data
    assert b"Admin Login" in response.data


def test_admin_login_success(client):
    """Test successful admin login."""
    response = client.post('/admin/login', data={
        'username': 'admin',
        'password': 'password123'
    }, follow_redirects=True)
    assert response.status_code == 200
    assert b"Admin Dashboard" in response.data


def test_admin_login_failure(client):
    """Test failed admin login."""
    response = client.post('/admin/login', data={
        'username': 'admin',
        'password': 'wrongpassword'
    }, follow_redirects=True)
    assert response.status_code == 200
    assert b"Invalid credentials" in response.data
