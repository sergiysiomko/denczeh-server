const express = require("express");
const ServiceModel = require("../dbmodels/services-model");

module.exports.add = (req, res) => {
  let serv = new ServiceModel(req.body);
  serv.save(() => res.render("add-service"));
};
