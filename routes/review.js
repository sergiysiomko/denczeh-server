const express = require("express");
const router = express.Router();
const passport = require("passport");
const controller = require("../controllers/review.controller");

router.get("/", passport.isLoggedIn, controller.root);

module.exports = router;
