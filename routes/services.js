const express = require("express");
const router = express.Router();
const passport = require("passport");
const controller = require("../controllers/services.controller");

router.get("/", (req, res) => {
  res.render("services");
});
router.get("/add", passport.isLoggedIn, (req, res) => {
  res.render("add-service");
});
router.post("/add", passport.isLoggedIn, controller.add);

module.exports = router;
