const {getVideocode, rus_to_latin, render} = require('./utils');
// const passport = require('passport');
const Vacancies = require('../dbmodels/vacancy-model');
const amoCrm = require('../services/amo-crm.service');

const CATEGORIES = {czech: 'Чехія', polska: 'Польща', belgium: 'Бельгія', slovakia: 'Словаччина'};

async function getActiveVacancies(req, res) {
  let vacancies = await Vacancies.find({isActive: true});

  vacancies.reverse();
  res.render('vacancy/vacancies', {vacancies, auth: req.isAuthenticated()});
}
function addVacancyPage(req, res) {
  res.render('vacancy/add-vacancy');
}
async function addVacancy(req, res) {
  try {
    let images = req.files['images'];
    req.body.images = images ? images.map(img => img.location) : [];

    let faceImage = req.files['faceImage'];
    req.body.faceImage = faceImage ? req.files['faceImage'][0].location : '';

    req.body.link = req.body.link || rus_to_latin(req.body.title);

    // youtube code
    let {youtube} = req.body;
    req.body.videocode = getVideocode(youtube);

    // country
    let {country} = req.body;
    if (country) {
      req.body.category = [];
      req.body.category.push(country);
    }
    let newVacancy = new Vacancies(req.body);
    await newVacancy.save();
    res.redirect('/vacancies/list');
  } catch (error) {
    res.render('error', {error});
  }
}

function editVacancyPage(req, res) {
  const {id} = req.params;
  Vacancies.findById(id, (error, v) => {
    if (error) {
      res.render('error', {error});
    }

    res.render('vacancy/edit-vacancy', {vacancy: v});
  });
}

async function editVacancy(req, res) {
  try {
    const {id} = req.params;
    let vacancy = await Vacancies.findById(id);

    // images
    let faceImage = null;
    if (req.files['faceImage']) {
      faceImage = req.files['faceImage'][0].location;
    }
    if (req.files.images) {
      vacancy.images = req.files['images'].map(img => img.location);
    }

    // youtube
    let {youtube} = req.body;
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
    vacancy.workers_count = req.body.workers_count;
    vacancy.bigDescription = req.body.bigDescription;
    vacancy.faceImage = faceImage || vacancy.faceImage;

    await vacancy.save();
    res.redirect('/vacancies/list');
  } catch (err) {
    console.log(err);
    res.redirect('/vacancies/list');
  }
}

async function removeVacancy(req, res) {
  try {
    let {id} = req.params;
    let d = await Vacancies.deleteOne({_id: id});
    res.redirect('/vacancies/list');
  } catch (error) {
    console.log(error);
    res.redirect('/vacancies/list');
  }
}

async function activateVacancy(req, res) {
  let {id} = req.params;
  Vacancies.findById(id, (error, v) => {
    if (error) {
      res.render('error', {error});
      return;
    }
    v.isActive = true;
    v.save(() => res.redirect('/vacancies/list'));
  });
}

function deactivateVacancy(req, res) {
  let {id} = req.params;
  Vacancies.findById(id, (error, v) => {
    if (error) {
      res.render('error', {error});
      return;
    }
    v.isActive = false;
    v.save(() => res.redirect('/vacancies/list'));
  });
}

function getList(req, res) {
  Vacancies.find({}, (error, vacancies) => {
    if (error) {
      console.log(error);
      res.render('error', {error});
      return;
    }
    vacancies.reverse();
    vacancies.sort((a, b) => b.isActive - a.isActive);
    res.render('vacancy/vacancies-list', {vacancies});
  });
}

async function getVacancy(req, res, next) {
  try {
    let vacancy = await Vacancies.findOne({
      link: req.params.link,
    });
    if (vacancy) {
      render(req, res, 'vacancy/vacancy', {vacancy});
    } else {
      //next(createError(404))
      res.redirect('/');
    }
  } catch (error) {
    next(error);
  }
}

async function getCategory(req, res) {
  let categoryParam = req.params.category;
  const category = CATEGORIES[categoryParam];
  let vacancies = await Vacancies.find({category, isActive: true});

  if (vacancies.length == 0) {
    res.redirect('/vacancies');
  } else res.render('vacancy/vacancies', {vacancies, auth: req.isAuthenticated()});
}

async function refreshToken(req, res) {
  try {
    let updateTokenObject = await amoCrm.updateToken();
    return res.json(updateTokenObject);
  } catch (error) {
    return res.json(error);
  }
}

async function addLead(req, res) {
  console.log(req.body);
  try {
    let data = {
      name: req.body.vacancyRegion,
      custom_fields_values: [
        {
          field_id: 867205,
          values: [
            {
              value: req.body.name,
            },
          ],
        },
        {
          field_id: 867203,
          values: [
            {
              value: req.body.phone,
            },
          ],
        },
        {
          field_id: 891289,
          values: [
            {
              value: req.body.vacancyName,
            },
          ],
        },
        {
          field_id: 891287,
          values: [
            {
              value: req.body.promocode,
            },
          ],
        },
      ],
    };

    let addedLead = await amoCrm.addLead(data);
    res.send({status: 'ok'});
  } catch (error) {
    return res.send(error);
  }
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
  addVacancyPage,
  refreshToken,
  addLead,
};
