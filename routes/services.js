const express = require("express");
const router = express.Router();
const passport = require("passport");
const controller = require("../controllers/services.controller");

router.get("/", controller.root);
router.get("/add", passport.isLoggedIn, (req, res) => {
  res.render("add-service");
});
router.post("/add", passport.isLoggedIn, controller.add);
router.get("/list", passport.isLoggedIn, controller.list);
router.get("/remove/:id", passport.isLoggedIn, controller.remove);

module.exports = router;
