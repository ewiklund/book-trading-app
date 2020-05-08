const express = require("express");
const router = express.Router();
var User = require("../models/user");
var Book = require("../models/book");

// display all books
router.get("/all", (req, res) => {
  // user not logged in
  if (!req.user) {
    res.render("login", {
      error_msg: "You must log in to see this page"
    });
  }
  else {
    // get all books from database and send to user
    Book.getAllBooks((err, books) => {
      if (err) throw err;

      if (books) {
        res.render("allBooks", {
          books: books,
          email: req.user.email
        });
      }
      else {
        res.render("allBooks", {
          books: [],
        });
      }
    });
  }
});

// display all books belonging to a user
router.get("/my", (req, res) => {
  if (!req.user) {
    res.render("login", {
      error_msg: "You must log in to see this page"
    });
  }
  else {
    // get all books of a particular user
    User.getUserByEmail(req.user.email, (err, user) => {
      if (err) throw err;

      if (user) {
        let myBooks = user.myBooks;

        res.render("myBooks", {
          myBooks: myBooks
        });
      }
      else {
        res.render("myBooks", {
          myBooks: []
        });
      }
    });
  }
});

// display add book page
router.get("/add", (req, res) => {
  if (!req.user) {
    res.render("login", {
      error_msg: "You must log in to see this page"
    });
  }
  else {
    res.render("addBook");
  }
});

module.exports = router;
