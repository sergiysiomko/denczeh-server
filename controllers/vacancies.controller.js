const { getVideocode, rus_to_latin } = require("./utils");
const passport = require("passport");
const Vacancies = require("../dbmodels/vacancy-model");

const CATEGORIES = { czech: "Чехія", polska: "Польща" };

async function getActiveVacancies(req, res) {
  let vacancies = await Vacancies.find({ isActive: true });

  vacancies.reverse();
  res.render("vacancies", { vacancies, auth: req.isAuthenticated() });
}
async function addVacancy(req, res) {
  try {
    let images = req.files["images"];
    req.body.images = images ? images.map((img) => img.location) : [];

    let faceImage = req.files["faceImage"];
    req.body.faceImage = faceImage ? req.files["faceImage"][0].location : "";

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

    // images
    let faceImage = null;
    if (req.files["faceImage"]) {
      faceImage = req.files["faceImage"][0].location;
    }
    if (req.files.images) {
      vacancy.images = req.files["images"].map((img) => img.location);
    }

    // youtube
    let { youtube } = req.body;
    req.body.youtube = undefined;
    const videocode = getVideocode(youtube);

    // fields
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
  try {
    let { id } = req.params;
    let d = await Vacancies.deleteOne({ _id: id });
    res.redirect("/vacancies/list");
  } catch (error) {
    console.log(error);
    res.redirect("/vacancies/list");
  }
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
}

async function getCategory(req, res) {
  let ctg = req.params.category;
  const category = CATEGORIES[ctg];
  let vacancies = await Vacancies.find({ category, isActive: true });

  if (vacancies.length == 0) {
    res.redirect("/vacancies");
  } else res.render("vacancies", { vacancies, auth: req.isAuthenticated() });
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
