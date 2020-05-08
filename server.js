
// Load in node modules
require('dotenv').config({ verbose: true });
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const exphbs = require('express-handlebars');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mongo = require('mongodb');
const mongoose = require("mongoose");

mongoose.connect(process.env.DB, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.set('useCreateIndex', true);

mongoose.connection.once('open', (err) => {
  if (err) {
    console.log("Error connecting to database:" .err);
  } else {
    console.log("Successfully connected to db");
  }});

  // declare the Routes

  const index = require("./routes/index");
  const users = require("./routes/users");
  const settings = require("./routes/settings");
  const books = require("./routes/books");
  const addBook = require("./routes/addBook");
  const getBook = require("./routes/getBook");
  const trade = require("./routes/trade");

  // Initialize the app
  const app = express();

  // view engine
  app.set("views", path.join(__dirname, "views"));
  app.engine("handlebars", exphbs({"defaultLayout": "layout"}));
  app.set("view engine", "handlebars");

  // BodyParser middleware

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({extended: false}));
  app.use(cookieParser());

  // Set the Static Folder

  app.use(express.static(__dirname + '/public'));

  // Express Session
app.use(session({
    secret: "secret",
    saveUninitialized: true,
    resave: true
}));

// Passport init
app.use(passport.initialize());
app.use(passport.session());

// Express Validator
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

// Connect Flash
app.use(flash());

// Global Vars
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  res.locals.user = req.user || null;
  next();
});


app.use("/", index);              // Homepage
app.use("/users", users);         // signup and login
app.use("/settings", settings);   // settings page
app.use("/books", books);         // display books
app.use("/add", addBook);         // add new books
app.use("/getBook", getBook);     // return book information
app.use("/trade", trade);         // make and accept trade requests

// handle page not found
app.use(function(req, res) {
  res.render("404");
});


app.listen(process.env.PORT || 3000, function() {
  console.log("Server is running");
});
