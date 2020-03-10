const express = require("express");
const router = express.Router();
const passport = require("passport");
const controller = require("../controllers/review.controller");
const multer = require("multer");
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    let dir = __dirname.split("\\");
    dir.length = dir.length - 1;
    dir = dir.join("\\");
    cb(null, dir + "\\public\\img\\reviews");
  },
  filename: function(req, file, cb) {
    let filename = file.originalname.split(".");
    filename.reverse();
    let type = filename.shift();
    filename.reverse();
    cb(null, `${filename}-${Date.now()}.${type}`);
  }
});
const upload = multer({ storage });

router.get("/", controller.root);

router.post("/add/video", passport.isLoggedIn, controller.addVideo);
router.post(
  "/add/image",
  passport.isLoggedIn,
  upload.single("image"),
  controller.addImage
);

router.get("/add/video", passport.isLoggedIn, (req, res) =>
  res.render("review-add-video")
);

router.get("/add/image", passport.isLoggedIn, (req, res) =>
  res.render("review-add-image")
);
router.get("/list", passport.isLoggedIn, controller.getList);

module.exports = router;
