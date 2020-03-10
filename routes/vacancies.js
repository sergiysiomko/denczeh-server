const express = require("express");
const createError = require("http-errors");
const router = express.Router();
const Vacancies = require("../dbmodels/vacancy-model");
const passport = require("passport");
const multer = require("multer");
const fs = require("fs");
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    let dir = __dirname.split("\\");
    dir.length = dir.length - 1;
    dir = dir.join("\\");
    dir = dir + "\\public\\img\\vacancies";
    console.log(dir);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    return cb(null, dir);
    // fs.exists(dir, exist => {
    //   if (!exist) {
    //     return fs.mkdir(dir, error => cb(error, dir));
    //   }
    //   return cb(null, dir);
    // });
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

router.get("/", async function(req, res, next) {
  let vacancies = await Vacancies.find({ isActive: true });

  vacancies.reverse();
  res.render("vacancies", { vacancies });
});

router.get("/add", passport.isLoggedIn, async function(req, res, next) {
  res.render("add");
});
const cpUpload = upload.fields([
  { name: "faceImage", maxCount: 1 },
  { name: "images", maxCount: 20 }
]);
router.post("/add", passport.isLoggedIn, cpUpload, async function(req, res) {
  try {
    let images = req.files["images"];
    req.body.images = images
      ? images.map(img => "/img/vacancies/" + img.filename)
      : [];
    let faceImage = req.files["faceImage"];
    req.body.faceImage = faceImage
      ? "/img/vacancies/" + req.files["faceImage"][0].filename
      : "";

    req.body.link = req.body.link || rus_to_latin(req.body.title);

    // youtube code
    let { youtube } = req.body;
    let code = youtube.split("/").reverse()[0];
    req.body.videocode = code;

    // country
    let { country } = req.body;
    if (country) {
      req.body.category = [];
      req.body.category.push(country);
    }
    let newVacancy = new Vacancies(req.body);
    await newVacancy.save();
    res.redirect("/vacancies/add");
  } catch (error) {
    res.render("error", { error });
  }
});
router.get("/remove/:id", passport.isLoggedIn, async (req, res) => {
  let { id } = req.params;
  let d = await Vacancies.deleteOne({ _id: id });

  res.redirect("/vacancies/list");
});
router.get("/activate/:id", passport.isLoggedIn, (req, res) => {
  let { id } = req.params;
  Vacancies.findById(id, (error, v) => {
    if (error) {
      res.render("error", { error });
      return;
    }
    v.isActive = true;
    v.save(() => res.redirect("/vacancies/list"));
  });
});
router.get("/deactivate/:id", passport.isLoggedIn, (req, res) => {
  let { id } = req.params;
  Vacancies.findById(id, (error, v) => {
    if (error) {
      res.render("error", { error });
      return;
    }
    v.isActive = false;
    v.save(() => res.redirect("/vacancies/list"));
  });
});

router.get("/list", passport.isLoggedIn, function(req, res) {
  Vacancies.find({}, (error, vacancies) => {
    if (error) {
      console.log(error);
      res.render("error", { error });
      return;
    }
    vacancies.sort((a, b) => b.isActive - a.isActive);
    res.render("vacancies-list", { vacancies });
  });
});
router.get("/:link", async function(req, res, next) {
  try {
    let vacancy = await Vacancies.findOne({
      link: req.params.link,
      isActive: true
    });
    if (vacancy) {
      res.render("vacancy", { vacancy });
    } else {
      //next(createError(404))
      res.redirect("/");
    }
  } catch (error) {
    next(error);
  }
  // let vacancy = await Vacancy.findOne({link:req.params.link})
  // res.render('vacancy', {vacancy:vacancy});
});

router.get("/type/:category", async (req, res) => {
  let ctg = req.params.category;
  let vacancies = await Vacancies.find({ category: ctg, isActive: true });
  if (vacancies.length == 0) {
    res.redirect("/vacancies");
  } else res.render("vacancies", { vacancies });
});

router.get("/json/:link", async function(req, res, next) {
  try {
    let vacancy = await Vacancies.findOne({ link: req.params.link });
    if (vacancy) res.json(vacancy);
    else next(createError(404));
  } catch (err) {
    next(createError(500));
  }
});

module.exports = router;

function rus_to_latin(str) {
  var ru = {
      а: "a",
      б: "b",
      в: "v",
      г: "g",
      д: "d",
      е: "e",
      ё: "e",
      ж: "j",
      з: "z",
      и: "i",
      к: "k",
      л: "l",
      м: "m",
      н: "n",
      о: "o",
      п: "p",
      р: "r",
      с: "s",
      т: "t",
      у: "u",
      ф: "f",
      х: "h",
      ц: "c",
      ч: "ch",
      ш: "sh",
      щ: "shch",
      ы: "y",
      э: "e",
      ю: "u",
      я: "ya",
      " ": "-"
    },
    n_str = [];

  str = str.replace(/[ъь]+/g, "").replace(/й/g, "i");

  for (var i = 0; i < str.length; ++i) {
    n_str.push(
      ru[str[i]] ||
        (ru[str[i].toLowerCase()] == undefined && str[i]) ||
        ru[str[i].toLowerCase()].replace(/^(.)/, function(match) {
          return match.toUpperCase();
        })
    );
  }

  return n_str.join("");
}
