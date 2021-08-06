const express = require('express');
const createError = require('http-errors');
const router = express.Router();
const passport = require('passport');
const {upload} = require('./utils');

const controller = require('../controllers/vacancies.controller');

router.get('/', controller.getActiveVacancies);

router.get('/add', passport.isLoggedIn, controller.addVacancyPage);
const cpUpload = upload.fields([
  {name: 'faceImage', maxCount: 1},
  {name: 'images', maxCount: 20},
]);
router.post('/add', passport.isLoggedIn, cpUpload, controller.addVacancy);

router.get('/edit/:id', passport.isLoggedIn, controller.editVacancyPage);

router.post('/edit/:id', passport.isLoggedIn, cpUpload, controller.editVacancy);

router.get('/remove/:id', passport.isLoggedIn, controller.removeVacancy);

router.get('/activate/:id', passport.isLoggedIn, controller.activateVacancy);

router.get('/deactivate/:id', passport.isLoggedIn, controller.deactivateVacancy);

router.get('/list', passport.isLoggedIn, controller.getList);

router.get('/crm-api-refresh-token', passport.isLoggedIn, controller.refreshToken);

router.use((req, res, next) => {
  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', 'https://denysiukjob.com.ua');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});

router.post('/lead', controller.addLead);

router.get('/:link', controller.getVacancy);

router.get('/type/:category', controller.getCategory);

router.get('/json/:link');

module.exports = router;
