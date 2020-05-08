const express = require("express");
const router = express.Router();
var Book = require("../models/book");
var User = require("../models/user");

// add a book to database
router.post("/", (req, res) => {
  // make sure user is logged in
  if (!req.user) {
    res.render("login", {
      error_msg: "You must log in to access this page"
    });
  }
  else {
    // extract book information
    let url = '';
    for (let prop in req.body) {
      url = prop;
    }

    let idIndex = url.indexOf('id=');
    let imageIndex = url.indexOf('image=');
    let name = url.substring(5, idIndex-1);
    let id = url.substring(idIndex+3, imageIndex-1);
    let image = url.substring(imageIndex+6, url.length);
    let owner = req.user.name;
    let ownerEmail = req.user.email;

    Book.getBookById(id, (err, book) => {
      if (err) throw err;

      if (book) {
        res.end("exist");
      } else {
        // create a new book record
        var newBook = Book({
          name: name,
          image: image,
          id: id,
          owner: owner,
          ownerEmail: ownerEmail
        });

        // add the book to books collection
        Book.addBook(newBook, (err, msg) => {
          if (err) throw err;
          console.log(msg);
        });

        // add book to user's records
        User.addBook(ownerEmail, id, (err, msg) => {
          if (err) throw err;
          console.log(msg);
        });

        res.end("success");
      }
    });
  }
});


module.exports = router;
