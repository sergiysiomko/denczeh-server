const express = require("express");
const router = express.Router();
const passport = require("passport");
const controller = require("../controllers/services.controller");

router.get("/", controller.root);
router.get("/add", passport.isLoggedIn, (req, res) => {
  res.render("services/add-service");
});
router.post("/add", passport.isLoggedIn, controller.add);
router.get("/edit/:id", passport.isLoggedIn, controller.editPage);
router.post("/edit/:id", passport.isLoggedIn, controller.edit);
router.get("/list", passport.isLoggedIn, controller.list);
router.get("/remove/:id", passport.isLoggedIn, controller.remove);

module.exports = router;
