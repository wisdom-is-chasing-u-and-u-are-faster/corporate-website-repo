"""
app.py — Flask Web Application for Forge Corporate Website
Scaffolded by jira_to_code for ARCH-388.
"""

from typing import Union
from flask import Flask, render_template, Response

app = Flask(__name__)


@app.route("/")
@app.route("/home")
def home() -> Union[str, Response]:
    """REQ-F-001 / AC: Verify that a home page is implemented."""
    return render_template("home.html")


@app.route("/solutions")
def solutions() -> Union[str, Response]:
    """REQ-F-002 / AC: Verify that a solutions page is implemented."""
    return render_template("solutions.html")


@app.route("/about")
def about() -> Union[str, Response]:
    """REQ-F-003 / AC: Verify that an about us page is implemented."""
    return render_template("about.html")


@app.route("/contact")
def contact() -> Union[str, Response]:
    """REQ-F-004 / AC: Verify that a contact us page is implemented."""
    return render_template("contact.html")


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
