var express = require('express');
var router = express.Router();
//var mongoose = require('mongoose');
var Vacancy = require('../dbmodels/vacancy-model');

/* GET home page. */
router.get('/', async function(req, res, next) {
  
  let vacancies = await Vacancy.find({}).limit(16);
  //console.log(vacancies);

  res.render("index", {vacancies, auth:req.isAuthenticated()});
});

module.exports = router;
