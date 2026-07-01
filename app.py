from flask import Flask, render_template, request, flash, redirect, url_for, abort
from config import Config
import json
import os

app = Flask(__name__)
app.config.from_object(Config)

# Basic authentication dictionary for demo purposes
# In production, use a database and secure hashing
ADMIN_USERS = {
    "admin": "password123"
}


def load_blog_posts():
    """Load blog posts from the JSON data file."""
    data_file = os.path.join(app.root_path, 'data', 'blog_posts.json')
    try:
        with open(data_file, 'r') as f:
            return json.load(f)
    except FileNotFoundError:
        return []


@app.route('/')
def home():
    """The user must be able to navigate to and view the Home page."""
    return render_template('home.html', title="Home")


@app.route('/about')
def about():
    """The user must be able to navigate to and view the About Us page."""
    return render_template('about.html', title="About Us")


@app.route('/products')
def products():
    """The user must be able to navigate to and view the Products page."""
    return render_template('products.html', title="Products")


@app.route('/services')
def services():
    """The user must be able to navigate to and view the Services page."""
    return render_template('services.html', title="Services")


@app.route('/contact', methods=['GET', 'POST'])
def contact():
    """The user must be able to navigate to and view the Contact Us page."""
    if request.method == 'POST':
        # Simulate form submission handling
        flash(
            "Thank you for your message. We will get back to you shortly!",
            "success")
        return redirect(url_for('contact'))
    return render_template('contact.html', title="Contact Us")


@app.route('/blog')
def blog():
    """The user must be able to view a list of blog posts."""
    posts = load_blog_posts()
    return render_template('blog.html', title="Blog", posts=posts)


@app.route('/blog/<int:post_id>')
def blog_post(post_id):
    """The user must be able to click to read a full post."""
    posts = load_blog_posts()
    post = next((p for p in posts if p['id'] == post_id), None)
    if post is None:
        abort(404)
    return render_template('blog_post.html', title=post['title'], post=post)


@app.route('/admin/login', methods=['GET', 'POST'])
def admin_login():
    """An admin user must be able to log in to a secure area."""
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')
        if ADMIN_USERS.get(username) == password:
            # Simulate successful login setup (in a real app, use flask_login)
            # We use a simple cookie-based approach for this mockup
            resp = redirect(url_for('admin_dashboard'))
            resp.set_cookie('admin_logged_in', 'true')
            return resp
        else:
            flash("Invalid credentials", "danger")
    return render_template('admin_login.html', title="Admin Login")


@app.route('/admin/dashboard')
def admin_dashboard():
    """Secure area to manage content."""
    # Check if admin is logged in (mockup check)
    if request.cookies.get('admin_logged_in') != 'true':
        flash("Please log in to access the dashboard", "warning")
        return redirect(url_for('admin_login'))
    return render_template('admin_dashboard.html', title="Admin Dashboard")


@app.route('/admin/logout')
def admin_logout():
    resp = redirect(url_for('home'))
    resp.set_cookie('admin_logged_in', '', expires=0)
    flash("You have been logged out.", "info")
    return resp


if __name__ == '__main__':
    app.run(debug=True)
