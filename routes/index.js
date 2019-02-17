var express = require('express');
var router = express.Router();
//var mongoose = require('mongoose');
var Vacancy = require('../dbmodels/vacancy-model');

/* GET home page. */
router.get('/', async function(req, res, next) {
  // var v= new Vacancy({
  //   "title" : "Збір, комплектація і пакування техніки Panasonic",
  //   "payment" : 100,
  //   "currency":"крон/год",
  //   "faceImage":"vacancy1.jpg",
  //   "description" : "some description",
  //   "bigDescription" : "some big description",
  //   "location" : "Чехія, Плзень",
  //   "link" : "Panasonic",
  // })
  // await v.save();
  var vacancies = await Vacancy.find({});
  //console.log(vacancies);
  res.render("index", {vacancies:vacancies});
});

module.exports = router;
