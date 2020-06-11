const express = require("express");
const router = express.Router();
//var mongoose = require('mongoose');
const Vacancy = require("../dbmodels/vacancy-model");
const { render } = require("./utils");

/* GET home page. */
router.get("/", async function(req, res, next) {
  let vacancies = await Vacancy.find({ isActive: true }).limit(16);

  render(req, res, "index", { vacancies });
});

module.exports = router;
