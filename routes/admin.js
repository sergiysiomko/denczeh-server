const express = require("express");
const router = express.Router();
const passport = require("passport");

router.get("/", passport.isLoggedIn, (req, res) => {
  let { login } = req.user;

  res.render("user", { login });
});

router.get("/cabinet", passport.isLoggedIn, (req, res) => {
  res.render("admin");
});
router.get("/register", passport.isLoggedIn, function(req, res, next) {
  res.render("register");
});
router.get("/login", function(req, res, next) {
  res.render("login");
});
router.post(
  "/register",
  passport.isLoggedIn,
  passport.authenticate("local-signup", {
    successRedirect: "/", // redirect to the secure profile section
    failureRedirect: "/admin/register"
  })
);

router.post(
  "/login",
  passport.authenticate("local-login", {
    successRedirect: "/",
    failureRedirect: "/admin/login",
    failureFlash: true
  })
);

router.get("/logout", passport.isLoggedIn, function(req, res) {
  req.logout();
  res.redirect("/");
});

module.exports = router;
