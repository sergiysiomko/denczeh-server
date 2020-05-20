const createError = require("http-errors");
const express = require("express");
const router = express.Router();

const Vacancies = require("../dbmodels/vacancy-model");

async function getActiveVacancies(req, res) {
  let vacancies = await Vacancies.find({ isActive: true });

  vacancies.reverse();
  res.render("vacancies", { vacancies, auth: req.isAuthenticated() });
}
async function addVacancy(req, res) {
  try {
    let images = req.files["images"];
    req.body.images = images
      ? images.map((img) => "/img/vacancies/" + img.filename)
      : [];
    let faceImage = req.files["faceImage"];
    req.body.faceImage = faceImage
      ? "/img/vacancies/" + req.files["faceImage"][0].filename
      : "";

    req.body.link = req.body.link || rus_to_latin(req.body.title);

    // youtube code
    let { youtube } = req.body;
    req.body.videocode = getVideocode(youtube);

    // country
    let { country } = req.body;
    if (country) {
      req.body.category = [];
      req.body.category.push(country);
    }
    let newVacancy = new Vacancies(req.body);
    await newVacancy.save();
    res.redirect("/vacancies/list");
  } catch (error) {
    res.render("error", { error });
  }
}

function editVacancyPage(req, res) {
  const { id } = req.params;
  Vacancies.findById(id, (error, v) => {
    if (error) {
      res.render("error", { error });
    }

    res.render("edit-vacancy", { vacancy: v });
  });
}

async function editVacancy(req, res) {
  try {
    const { id } = req.params;
    let vacancy = await Vacancies.findById(id);
    let { youtube } = req.body;
    let faceImage = null;
    if (req.files["faceImage"]) {
      faceImage = "/img/vacancies/" + req.files["faceImage"][0].filename;
    }
    req.body.youtube = undefined;
    const videocode = getVideocode(youtube);

    vacancy.title = req.body.title;
    vacancy.payment = req.body.payment;
    vacancy.paymentMounth = req.body.paymentMounth;
    vacancy.shchedule = req.body.shchedule;
    vacancy.habitation = req.body.habitation;
    vacancy.location = req.body.location;
    vacancy.videocode = videocode;
    vacancy.bigDescription = req.body.bigDescription;
    vacancy.faceImage = faceImage || vacancy.faceImage;

    await vacancy.save();
    res.redirect("/vacancies/list");
  } catch (err) {
    console.log(err);
    res.redirect("/vacancies/list");
  }
}

async function removeVacancy(req, res) {
  let { id } = req.params;
  let d = await Vacancies.deleteOne({ _id: id });

  res.redirect("/vacancies/list");
}

async function activateVacancy(req, res) {
  let { id } = req.params;
  Vacancies.findById(id, (error, v) => {
    if (error) {
      res.render("error", { error });
      return;
    }
    v.isActive = true;
    v.save(() => res.redirect("/vacancies/list"));
  });
}

function deactivateVacancy(req, res) {
  let { id } = req.params;
  Vacancies.findById(id, (error, v) => {
    if (error) {
      res.render("error", { error });
      return;
    }
    v.isActive = false;
    v.save(() => res.redirect("/vacancies/list"));
  });
}

function getList(req, res) {
  Vacancies.find({}, (error, vacancies) => {
    if (error) {
      console.log(error);
      res.render("error", { error });
      return;
    }
    vacancies.reverse();
    vacancies.sort((a, b) => b.isActive - a.isActive);
    res.render("vacancies-list", { vacancies });
  });
}

async function getVacancy(req, res, next) {
  try {
    let vacancy = await Vacancies.findOne({
      link: req.params.link,
      isActive: true,
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
}

async function getCategory(req, res) {
  let ctg = req.params.category;
  let vacancies = await Vacancies.find({ category: ctg, isActive: true });
  if (vacancies.length == 0) {
    res.redirect("/vacancies");
  } else res.render("vacancies", { vacancies });
}

module.exports = {
  getActiveVacancies,
  addVacancy,
  removeVacancy,
  activateVacancy,
  deactivateVacancy,
  getList,
  getVacancy,
  getCategory,
  editVacancy,
  editVacancyPage,
};

// utils

function getVideocode(link) {
  let code = "";
  if (/youtu.be/.test(link)) {
    code = link.split("/").reverse()[0];
    return code || undefined;
  }
  if (/www.youtube.com/.test(link)) {
    const reg = /v=([a-zA-Z0-9]+)/;
    let match = reg.exec(link);
    return match[1];
  }
  return "";
}

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
      " ": "-",
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
