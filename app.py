"""
Forge Corporate Website Application.
Scaffolded for Jira ticket ARCH-388.
"""
import os
from typing import Any
from flask import Flask, render_template, Response

app = Flask(__name__)


@app.route("/")
@app.route("/home")
def home() -> Any:
    """
    Home page endpoint for Forge corporate website.
    AC: Verify that a home page is implemented.
    AC: Verify that the website is responsive on desktop and mobile devices.
    """
    return render_template("home.html")


@app.route("/solutions")
def solutions() -> Any:
    """
    Solutions page endpoint showcasing enterprise software solutions.
    AC: Verify that a solutions page is implemented.
    AC: Verify that the website is responsive on desktop and mobile devices.
    """
    return render_template("solutions.html")


@app.route("/about")
@app.route("/about-us")
def about() -> Any:
    """
    About Us page endpoint detailing company mission and leadership.
    AC: Verify that an about us page is implemented.
    AC: Verify that the website is responsive on desktop and mobile devices.
    """
    return render_template("about.html")


@app.route("/contact")
@app.route("/contact-us")
def contact() -> Any:
    """
    Contact Us page endpoint featuring contact form and office locations.
    AC: Verify that a contact us page is implemented.
    AC: Verify that the website is responsive on desktop and mobile devices.
    """
    return render_template("contact.html")


@app.route("/health")
def health() -> Response:
    """Health check endpoint for monitoring."""
    return Response("OK", status=200, mimetype="text/plain")


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="127.0.0.1", port=port, debug=False)
