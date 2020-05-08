var mongoose = require("mongoose");
var bcrypt = require("bcryptjs");

var userSchema = mongoose.Schema({
  name: String,
  email: {type: String, unique: true, index: true},
  password: String,
  city: String,
  state: String,
  myBooks: [String],            // will contain id of the book
  myTradeRequest: [],     // add the book to my myTradeRequest and owner's otherTradeRequest
  otherTradeRequest: []   // [bookId, bookName, otherEmail]
});

User = module.exports = mongoose.model("bookUser", userSchema);

// add/register a new user to the database
module.exports.createUser = (newUser, callback) => {
  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(newUser.password, salt, function(err, hash) {
      newUser.password = hash;
      newUser.save(callback);
    });
  });
}

// add a book to user's myBooks
module.exports.addBook = (email, bookId, callback) => {
  User.update({email: email}, {$push: {myBooks: bookId}}, callback);
}

// get user information by email
module.exports.getUserByEmail = (email, callback) => {
  let query = {email: email};
  User.findOne(query, callback);
}

// update details of a user
module.exports.updateDetails = (email, details, callback) => {
  User.update(
    {email: email},
    {name: details.name, city: details.city, state: details.state},
    callback);
}

// compare password for login and password change
module.exports.comparePassword = function(candidatePassword, hash, callback) {
  bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
    if (err) throw err;
    callback(null, isMatch);
  });
}

// change given user's password
module.exports.changePassword = (email, newPass, callback) => {
  User.findOne({email: email}, (err, user) => {
    if (err) throw err;

    if (user) {
      bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(newPass, salt, function(err, hash) {
          User.update({email: email}, {password: hash}, callback);
        });
      });
    }
  });
}

// get trade requests of the given user
module.exports.getMyTradeRequests = (email, callback) => {
  User.find({email: email}).select({myTradeRequest: 1, _id: 0}).exec(callback);
}


// get other trade requests of the given user
module.exports.getOtherTradeRequests = (email, callback) => {
  User.find({email: email}).select({otherTradeRequest: 1, _id: 0}).exec(callback);
}


// add the following trade request to given user's other trde request
module.exports.addOtherTradeRequest = (bookId, bookName, myEmail, otherEmail, callback) => {
  let entry = [bookId, bookName, otherEmail];

  // check whether trade request already exist
  User.findOne({email: myEmail}, (err, user) => {
    if (err) throw err;

    // if user exists
    if (user) {
      // check whether trade request already exists
      let index = -1;

      for (let i in user.otherTradeRequest) {
        if (user.otherTradeRequest[i][2] == otherEmail &&
            user.otherTradeRequest[i][0] == bookId) {
          index = i;
          break;
        }
      }

      // trade request already exists
      if (index > -1) {
        console.log("Already exists");
      }
      // trade request doesn't exist, add now
      else {
        User.update({email: myEmail},
          {$push: {otherTradeRequest: entry}}, callback);

      }
    }
  });
}

// add the following trade request to given user's my trade request
module.exports.addMyTradeRequest = (bookId, bookName, myEmail, otherEmail, callback) => {
  let entry = [bookId, bookName, otherEmail];

  // check whether trade request already exist
  User.findOne({email: myEmail}, (err, user) => {
    if (err) throw err;

    // if user exists
    if (user) {
      let index = -1;

      for (let i in user.myTradeRequest) {
        if (user.myTradeRequest[i][0] == bookId) {
          index = i;
          break;
        }
      }

      // trade request already exists
      if (index > -1) {
        console.log("Already exists");
      }
      // trade request doesn't exists, add now
      else {
        User.update({email: myEmail},
          {$push: {myTradeRequest: entry}}, callback);
      }
    }
  });
}

// delete a request from given user's my trade request
module.exports.deleteMyTradeRequest = (bookId, myEmail, callback) => {
  User.findOne({email: myEmail}, (err, user) => {
    if (err) throw err;

    // if user exists
    if (user) {
      // check whether the trade request exist or not
      let index = -1;
      let myTR = user.myTradeRequest;

      console.log(bookId, myTR);
      for (let i in user.myTradeRequest) {
        if (user.myTradeRequest[i][0] == bookId) {
          index = i;
          console.log(index);
          break;
        }
      }

      // request exists, delete it
      if (index > -1) {
        myTR.splice(index, 1);

        User.update({email: myEmail}, {myTradeRequest: myTR}, (err, msg) => {
          if (err) throw err;
          console.log(msg);
        });
      }
      // request does not exists
      else {
        console.log("Not in database");
      }
    }
    else {
      console.log("Wrong User");
    }
  });
}

// delete a request from given user's other trade request
module.exports.deleteOtherTradeRequest = (bookId, myEmail, otherEmail, callback) => {

  User.findOne({email: myEmail}, (err, user) => {
    if (err) throw err;

    // if user exists
    if (user) {
      // check whether trade request exists or not
      let index = -1;
      let otherTR = user.otherTradeRequest;

      for (let i in user.otherTradeRequest) {
        if (user.otherTradeRequest[i][2] == otherEmail &&
            user.otherTradeRequest[i][0] == bookId) {
          index = i;
          break;
        }
      }

      // trade request exists, delete it
      if (index > -1) {
        otherTR.splice(index, 1);

        User.update({email: myEmail}, {otherTradeRequest: otherTR}, (err, msg) => {
          if (err) throw err;
          console.log(msg);
        });
      }
      // trade request doesn't exists
      else {
        console.log("Not in database");
      }
    }
    // user doesn't exists
    else {
      console.log("Wrong User");
    }
  });
}
