const express = require("express");
const router = express.Router();
const passport = require("passport");
const controller = require("../controllers/admin.controller");

router.get("/", passport.isLoggedIn, controller.userPage);
router.get("/cabinet", passport.isLoggedIn, controller.adminPage);
router.get("/register", passport.isLoggedIn, controller.registerPage);
router.get("/login", controller.loginPage);

router.post(
  "/register",
  passport.isLoggedIn,
  passport.authenticate("local-signup", {
    successRedirect: "/", // redirect to the secure profile section
    failureRedirect: "/admin/register",
  })
);

router.post(
  "/login",
  passport.authenticate("local-login", {
    successRedirect: "/",
    failureRedirect: "/admin/login",
    failureFlash: true,
  })
);

router.get("/logout", passport.isLoggedIn, controller.logout);

module.exports = router;
