from flask import Flask, render_template

app = Flask(__name__)

@app.route("/")
@app.route("/home.html")
def home():
    return render_template("home.html")

@app.route("/about")
@app.route("/about.html")
def about():
    return render_template("about.html")

@app.route("/products")
@app.route("/products.html")
def products():
    return render_template("products.html")

@app.route("/services")
@app.route("/services.html")
def services():
    return render_template("services.html")

@app.route("/blog")
@app.route("/blog.html")
def blog():
    return render_template("blog.html")

@app.route("/blog-post")
@app.route("/blog-post.html")
def blog_post():
    return render_template("blog-post.html")

@app.route("/contact")
@app.route("/contact.html")
def contact():
    return render_template("contact.html")

@app.route("/admin-login")
@app.route("/admin-login.html")
def admin_login():
    return render_template("admin-login.html")

@app.route("/admin-dashboard")
@app.route("/admin-dashboard.html")
def admin_dashboard():
    return render_template("admin-dashboard.html")

@app.route("/index.html")
def index_preview():
    return render_template("index.html")

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8080, debug=True)
