import pytest
from app import app


@pytest.fixture
def client():
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client


def test_blog_list_page(client):
    """Test that the blog listing page loads successfully."""
    response = client.get('/blog')
    assert response.status_code == 200
    assert b"Corporate Blog" in response.data


def test_blog_post_page(client):
    """Test that an individual blog post page loads successfully."""
    # Assuming post ID 1 always exists in our mock data
    response = client.get('/blog/1')
    assert response.status_code == 200
    assert b"Welcome to Our New Website" in response.data


def test_blog_post_not_found(client):
    """Test that requesting a non-existent blog post returns 404."""
    response = client.get('/blog/999')
    assert response.status_code == 404
