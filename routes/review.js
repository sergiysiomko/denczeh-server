const express = require("express");
const router = express.Router();
const passport = require("passport");
const controller = require("../controllers/review.controller");

router.get("/", controller.root);

router.post("/add/video", passport.isLoggedIn, controller.addVideo);
router.post("/add/image", passport.isLoggedIn, controller.addImage);

router.get("/add/video", passport.isLoggedIn, (req, res) =>
  res.render("review-add-video")
);
router.get("/add/image", passport.isLoggedIn, (req, res) =>
  res.render("review-add-image")
);
router.get("/list", passport.isLoggedIn, controller.getList);

module.exports = router;
