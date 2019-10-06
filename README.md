# Bookistic
![Website Status](https://img.shields.io/website/https/bookistic.herokuapp.com?down_color=lightgrey&down_message=offline&style=flat-square&up_color=blue&up_message=online)
![Security Headers](https://img.shields.io/security-headers?style=flat-square&url=https%3A%2F%2Fbookistic.herokuapp.com)
![Hit Count](http://hits.dwyl.io/udit-001/book-review.svg)

**Website** - [https://bookistic.herokuapp.com](https://bookistic.herokuapp.com)

## Overview 
In this project, you’ll build a book review website. Users will be able to register for your website and then log in using their username and password. Once they log in, they will be able to search for books, leave reviews for individual books, and see the reviews made by other people. You’ll also use the a third-party API by Goodreads, another book review website, to pull in ratings from a broader audience. Finally, users will be able to query for book details and book reviews programmatically via your website’s API.

## Features
Alright, it’s time to actually build your web application! Here are the features:

- 👤 **Registration**: Users should be able to register for your website, providing (at minimum) a username and password.

- 🔓 **Login**: Users, once registered, should be able to log in to your website with their username and password.

- 🔒 **Logout**: Logged in users should be able to log out of the site.

- 🔍 **Search**: Once a user has logged in, they should be taken to a page where they can search for a book. Users should be able to type in the ISBN number of a book, the title of a book, or the author of a book. After performing the search, your website should display a list of possible matching results, or some sort of message if there were no matches. If the user typed in only part of a title, ISBN, or author name, your search page should find matches for those as well!

- 📖 **Book Page**: When users click on a book from the results of the search page, they should be taken to a book page, with details about the book: its title, author, publication year, ISBN number, and any reviews that users have left for the book on your website.

- 📝 **Review Submission**: On the book page, users should be able to submit a review: consisting of a rating on a scale of 1 to 5, as well as a text component to the review where the user can write their opinion about a book. Users should not be able to submit multiple reviews for the same book.

- 📚 **Goodreads Review Data**: On your book page, you should also display (if available) the average rating and number of ratings the work has received from Goodreads.

- 🤖 **API Access**: If users make a GET request to your website’s /api/{isbn} route, where {isbn} is an ISBN number, your website should return a JSON response containing the book’s title, author, publication date, ISBN number, review count, and average score. The resulting JSON should follow the format:
  
```json
  {
    "title": "Memory",
    "author": "Doug Lloyd",
    "year": 2015,
    "isbn": "1632168146",
    "review_count": 28,
    "average_score": 5.0
  }
```

If the requested ISBN number isn’t in your database, the website returns a 404 error.

## Technical Details
Python packages used: 

- [Flask](https://flask.palletsprojects.com/en/1.1.x/) : For writing the backend for our book review app.
- [Flask-SeaSurf](https://flask-seasurf.readthedocs.io/en/latest/) : For preventing CSRF attacks.
- [Flask-Talisman](https://github.com/GoogleCloudPlatform/flask-talisman) : For adding important HTTP security headers to our Flask app.
- [Flask-Bcrypt](https://flask-bcrypt.readthedocs.io/en/latest/) : Uses flask-bcrypt package to store your passwords securely in the database.
- [SQLAlchemy](https://www.sqlalchemy.org/) : For making our app work with any database provider.
