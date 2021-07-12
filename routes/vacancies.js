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

// router.get('/test', controller.test);
// router.get('/test2', controller.test2);
// router.get('/test3', controller.test3);

router.get('/:link', controller.getVacancy);

router.get('/type/:category', controller.getCategory);

router.get('/json/:link');

module.exports = router;
