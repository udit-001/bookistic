import gc
import json
import os
from functools import wraps
from pprint import pprint

import requests
from flask import (Flask, flash, jsonify, redirect, render_template, request,
                   session, url_for)
from flask_bcrypt import Bcrypt
from flask_seasurf import SeaSurf
from flask_talisman import Talisman
from sqlalchemy import create_engine
from sqlalchemy.orm import scoped_session, sessionmaker

from flask_session import Session

app = Flask(__name__)

SELF = '\'self\''
csp = {
    'default-src': SELF,
}

Talisman(app, content_security_policy=csp,
         content_security_policy_nonce_in=['script-src'], content_security_policy_report_only=True, content_security_policy_report_uri='/report')

# Check for environment variable
if not os.getenv("DATABASE_URL"):
    raise RuntimeError("DATABASE_URL is not set")

# Configure session to use filesystem
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)
bcrypt = Bcrypt(app)
csrf = SeaSurf(app)


if not os.getenv("GOODREADS_API"):
    raise RuntimeError("GOODREADS_API is not set")

goodreads_api = os.getenv("GOODREADS_API")

# Set up database
engine = create_engine(os.getenv("DATABASE_URL"))
db = scoped_session(sessionmaker(bind=engine))


def login_required(f):
    @wraps(f)
    def wrap(*args, **kwargs):
        if 'logged_in' in session:
            return f(*args, **kwargs)
        else:
            flash("You need to login first!", "email")
            return redirect(url_for("login_page"))

    return wrap


@app.route("/logout/")
@login_required
def logout():
    session.clear()
    flash("You have been logged out!")
    gc.collect()
    return redirect(url_for('search'))


@app.errorhandler(404)
def page_not_found(e):
    return render_template("ghost.html")


@app.route("/login/", methods=['POST', 'GET'])
def login_page():
    try:
        if request.method == "POST":
            email = request.form.get("email").lower()
            password = request.form.get("password")

            data = db.execute(
                "select * from users where email=:email", {"email": email}).fetchone()
            if data is not None:
                hashed = data[3]
                if bcrypt.check_password_hash(hashed, password):
                    session['logged_in'] = True
                    name = data[1]
                    session['first_name'] = name.title()
                    session['user_id'] = data[0]

                    return redirect(url_for("search"))
                else:
                    print("Password didn't match!")
                    flash("Invalid credentials", "password")
            else:
                print("Account not registered!")
                flash("Account not registered!", "email")

        gc.collect()
        return render_template("login.html")

    except Exception as e:
        error = "Invalid credentials, try again."
        return render_template("login.html", error=error)


@app.route("/register/", methods=['GET', 'POST'])
def register_page():
    try:
        if request.method == "POST":
            first_name = request.form.get('name').strip()
            email = request.form.get('email').lower()
            password = request.form.get('password')
            pw_hash = bcrypt.generate_password_hash(password)
            pw_hash = pw_hash.decode('utf8')

            session['first_name'] = first_name
            session['email'] = email
            x = db.execute("select * from users where email=:email",
                           {"email": email}).fetchone()

            if x != None:
                flash("Email account already exists!", "email")

            else:
                db.execute("INSERT INTO users (first_name, email, password) VALUES (:first_name, :email, :password)", {
                    'first_name': first_name, 'email': email, 'password': pw_hash})
                db.commit()

                session['logged_in'] = True

                x = db.execute(
                    "select * from users where email=:email", {"email": email}).fetchone()
                session['user_id'] = x[0]

                gc.collect()

                return render_template("register.html", register_success=True)

        return render_template("register.html", register_success=False)

    except Exception as e:
        return(str(e))


@app.route("/search/", methods=["GET"])
@login_required
def search():
    return render_template("search.html")


@app.route("/fetch", methods=["POST"])
def fetch():
    response = {}
    query = request.form.get("query")
    order = request.form.get("order")
    offset = request.form.get("offset")

    if offset is None:
        offset = 0

    try:
            # Add order by according to the radio button selected!
        results = db.execute("SELECT * FROM book WHERE isbn ILIKE :isbn OR author ILIKE :author OR title ILIKE :title ORDER BY "+order+" LIMIT 10 OFFSET "+str(offset), {
            "isbn": "%{}%".format(query), "author": "%{}%".format(query), "title": "%{}%".format(query)}).fetchall()

        response['data'] = 'Hello'
        data = []
        for result in results:
            data.append(list(result))

        response['results'] = data

        return jsonify(response)
    except Exception as e:
        return e


@app.route("/book/<int:book_id>", methods=['GET', 'POST'])
@login_required
def book(book_id):
    try:

        session['book_id'] = book_id
        if request.method == 'POST':
            user_id = session['user_id']
            rating = request.form.get('rating')
            review = request.form.get('reviews')

            data = db.execute("INSERT INTO reviews (user_id, book_id, rating, review, timestamp) VALUES (:user_id, :book_id, :rating, :review, NOW())", {
                'user_id': user_id, 'book_id': book_id, 'rating': rating, 'review': review})

            db.commit()

            return redirect(url_for('book', book_id=book_id))

        else:
            book = db.execute("SELECT isbn, title, author, year FROM book WHERE book_id=:id", {
                "id": book_id}).fetchone()

            res = requests.get("https://www.goodreads.com/book/review_counts.json",
                               params={"key": goodreads_api, "isbns": book[0]})

            data = res.json()
            ratings = {'average_rating': data['books'][0]['average_rating'],
                       'work_ratings_count': data['books'][0]['work_ratings_count']}

            reviews = db.execute(
                "SELECT u.first_name, u.user_id, r.rating, r.review, timezone('Asia/Kolkata',r.timestamp) FROM reviews as r INNER JOIN users as u on r.user_id = u.user_id INNER JOIN book as b on r.book_id = b.book_id where b.book_id = :book_id", {'book_id': book_id}).fetchall()

            if reviews != []:
                return render_template("book.html", book=book, ratings=ratings, reviews=reviews)
            else:
                return render_template("book.html", book=book, ratings=ratings)

    except Exception as e:
        return render_template("ghost.html")


@app.route("/account/", methods=['POST', 'GET'])
@login_required
def account_page():
    try:
        if request.method == 'POST':
            first_name = request.form.get('name').strip()
            user_id = session['user_id']

            x = db.execute("UPDATE users SET first_name=:first_name WHERE user_id=:id",
                           {'id': user_id, 'first_name': first_name})
            db.commit()

            session['first_name'] = first_name

            return redirect(url_for('account_page'))
        else:
            return render_template("account.html")

    except Exception as e:
        return(str(e))


@app.route("/")
def root():
    return redirect(url_for('login_page'))


@app.route("/sw.js")
def sw():
    return app.send_static_file('sw.js')


@app.route("/api/<string:isbn>/")
def api(isbn):
    try:
        if isbn:
            book = db.execute("SELECT isbn, title, author, year FROM book WHERE isbn=:isbn", {
                "isbn": isbn}).fetchone()
            db.commit()

            if book is not None:
                response = {}
                res = requests.get("https://www.goodreads.com/book/review_counts.json",
                                   params={"key": goodreads_api, "isbns": isbn})

                data = res.json()

                response['title'] = book[1]
                response['isbn'] = book[0]
                response['year'] = book[3]
                response['author'] = book[2]
                response['average_rating'] = data['books'][0]['average_rating']
                response['work_ratings_count'] = data['books'][0]['work_ratings_count']

                return jsonify(response)

            else:
                response = {}
                response['error'] = "404 book not found!"

                return jsonify(response)

    except Exception as e:
        response = {}
        response['error'] = "404 book not found!"

        return jsonify(response)
