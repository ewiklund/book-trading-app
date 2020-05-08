const express = require("express");
const router = express.Router();
var Book = require("../models/book");

// returns the information about a particular book
router.use("/", (req, res) => {
  if (!req.user) {
    res.end("{error: 'not logged in'}");
  }
  else {
    let id = req.url.substring(1, req.url.length);

    Book.getBookById(id, (err, book) => {
      if (err) throw err;

      if (book) {
        let name = book.name;
        let image = book.image;
        let bookData = JSON.stringify({name: name, image: image});
        res.end(bookData);
      }
      else {
        res.end("{error: 'Wrong id'}");
      }
    });
  }
});


module.exports = router;
