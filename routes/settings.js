const express = require("express");
const router = express.Router();
var User = require("../models/user");

// Settings page request
router.get("/", (req, res) => {
  // user not logged in, redirect to login page
  if (!req.user) {
    res.redirect("/");
  }
  else {
    res.render("settings");
  }
});

// update information
router.post("/update", (req, res) => {
  // user not logged in, redirect to login page
  if (!req.user) {
    res.redirect("/login");
  }
  else {
    // get form data
    let name = req.body.name.trim();
    let city = req.body.city.trim();
    let state = req.body.state.trim();

    // validate data
    req.checkBody("name", "Name is required").notEmpty();
    req.checkBody("city", "City is required").notEmpty();
    req.checkBody("state", "State is required").notEmpty();

    // check whether there is any error
    var errors = req.validationErrors();

    // if errors, show errors
    if (errors) {
      res.render("settings", {
        errors: errors
      });
    }
    // update settings
    else {
      let details = {name: name, city: city, state: state};
      let email = req.user.email;

      User.updateDetails(email, details, (err, msg) => {
        if (err) throw err;
        console.log(msg);
      });

      res.render("settings", {
        success_msg: "Changes have been saved"
      });
    }
  }
});


router.post("/change-password", (req, res) => {
  // user not logged in, redirect to login page
  if (!req.user) {
    res.redirect("/login");
  }
  else {
    // get form data
    let oldPass = req.body.oldPass;
    let newPass = req.body.newPass;
    let confirmNewPass = req.body.confirmNewPass;

    // validate data
    req.checkBody("oldPass", "Old Password is required").notEmpty();
    req.checkBody("newPass", "New Password is required").notEmpty();
    req.checkBody("confirmNewPass", "Confirm New Password is required").notEmpty();
    req.checkBody("newPass", "Passwords do not match").equals(confirmNewPass);

    // check whether there is any error
    var errors = req.validationErrors();

    // if errors, show errors
    if (errors) {
      res.render("settings", {
        errors: errors
      });
    }
    // update settings
    else {
      // check whether old password is correct or not
      User.comparePassword(oldPass, req.user.password, (err, isMatch) => {
        if (err) throw err;

        // if old password is correct, change password
        if (isMatch) {
          User.changePassword(req.user.email, newPass, (err, msg) => {
            if (err) throw err;
            console.log(msg);
          });

          res.render("settings", {
            success_msg: "Password has been changed"
          });
        }
        // old password incorrect, show error
        else {
          res.render("settings", {
            errors: [{param: 'oldPass', msg: "Old Password is incorrect"}]
          });
        }
      });
    }
  }
});


module.exports = router;
