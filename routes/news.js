const express = require("express");
const router = express.Router();
const passport = require("passport");
const controller = require("../controllers/news.controller");
const { upload } = require("./utils");

const cpUpload = upload.fields([
  { name: "faceImage", maxCount: 1 },
  { name: "images", maxCount: 20 },
]);

router.get("/", controller.root);
router.get("/add", passport.isLoggedIn, controller.addNewsPage);
router.get("/edit/:id", passport.isLoggedIn, controller.editNewsPage);
router.get("/list", passport.isLoggedIn, controller.newsList);
router.post("/add", passport.isLoggedIn, cpUpload, controller.addNews);
router.post("/edit/:id", passport.isLoggedIn, cpUpload, controller.editNews);
router.get("/remove/:id", passport.isLoggedIn, controller.removeNews);
router.get("/:link", controller.getNewsPage);

module.exports = router;
