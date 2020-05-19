const express = require("express");
const createError = require("http-errors");
const router = express.Router();
const passport = require("passport");
const multer = require("multer");
const fs = require("fs");
const controller = require("../controllers/vacancies.controller");
const Vacancies = require("../dbmodels/vacancy-model");

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    let dir = __dirname.split("\\");
    dir.length = dir.length - 1;
    dir = dir.join("\\");
    dir = dir + "./public/img/vacancies";

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    return cb(null, dir);
  },
  filename: function(req, file, cb) {
    let filename = file.originalname.split(".");
    filename.reverse();
    let type = filename.shift();
    filename.reverse();
    cb(null, `${filename}-${Date.now()}.${type}`);
  },
});
const upload = multer({ storage });

router.get("/", controller.getActiveVacancies);

router.get("/add", passport.isLoggedIn, async function(req, res, next) {
  res.render("add-vacancy");
});
const cpUpload = upload.fields([
  { name: "faceImage", maxCount: 1 },
  { name: "images", maxCount: 20 },
]);
router.post("/add", passport.isLoggedIn, cpUpload, controller.addVacancy);

router.get("/edit/:id", passport.isLoggedIn, controller.editVacancyPage);

router.post("/edit/:id", passport.isLoggedIn, controller.editVacancy);

router.get("/remove/:id", passport.isLoggedIn, controller.removeVacancy);

router.get("/activate/:id", passport.isLoggedIn, controller.activateVacancy);

router.get(
  "/deactivate/:id",
  passport.isLoggedIn,
  controller.deactivateVacancy
);

router.get("/list", passport.isLoggedIn, controller.getList);

router.get("/:link", controller.getVacancy);

router.get("/type/:category", controller.getCategory);

router.get("/json/:link");

module.exports = router;
