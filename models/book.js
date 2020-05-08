var mongoose = require("mongoose");

var bookSchema = mongoose.Schema({
  id: {type: String, unique: true, index: true},
  name: String,
  image: String,
  owner: String,
  ownerEmail: String,
  shared: []
});

Book = module.exports = mongoose.model("Book", bookSchema);

// add a new book to the database
module.exports.addBook = (newBook, callback) => {
  newBook.save(callback);
}

module.exports.getBookById = (id, callback) => {
  Book.findOne({id: id}, callback);
}

module.exports.getAllBooks = (callback) => {
  Book.find().select({id: 1, name: 1, image: 1, ownerEmail: 1, shared: 1, _id: 0}).exec(callback);
}

module.exports.addSharedUser = (id, email, callback) => {
  Book.update({id: id}, {$push: {shared: email}}, callback);
}
