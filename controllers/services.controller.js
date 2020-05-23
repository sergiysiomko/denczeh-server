const express = require("express");
const ServiceModel = require("../dbmodels/services-model");

module.exports.root = async (req, res) => {
  let services = await ServiceModel.find({});
  services.reverse();
  res.render("services", { services, auth: req.isAuthenticated() });
};
module.exports.add = (req, res) => {
  let serv = new ServiceModel(req.body);
  serv.save(() => res.render("add-service"));
};

module.exports.editPage = async (req, res) => {
  let service = await ServiceModel.findById(req.params.id);
  res.render("edit-service", { service });
};

module.exports.edit = async (req, res) => {
  try {
    let service = await ServiceModel.findById(req.params.id);
    const { title, price, term, description } = req.body;
    service.title = title;
    service.price = price;
    service.term = term;
    service.description = description;
    await service.save();
    res.redirect("/services/list");
  } catch (err) {
    console.log(err);
    res.redirect("/services/list");
  }
};

module.exports.remove = async (req, res) => {
  let { id } = req.params;
  let s = await ServiceModel.deleteOne({ _id: id });

  res.redirect("/services/list");
};

module.exports.list = async (req, res) => {
  let services = await ServiceModel.find({});
  services.reverse();
  res.render("services-list", { services });
};
