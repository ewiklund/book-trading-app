const express = require("express");
const router = express.Router();

// Homepage request
router.get("/", (req, res) => {
  res.render("index", {
    user: req.user
  });
});


module.exports = router;
