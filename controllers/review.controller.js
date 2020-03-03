const express = require("express");
const VideoReviewModel = require("../dbmodels/video-review-model");
const ImageReviewModel = require("../dbmodels/image-review-model");

module.exports.root = async (req, res) => {
  let videos = await VideoReviewModel.find({});
  let images = await ImageReviewModel.find({});
  videos = videos.map(video => {
    let imgUrl = "";
    let re = /src=\"\S+\/(\S+)\"/i;
    if (video.iframe.search(re) != -1) {
      let code = video.iframe.match(re)[1];
      video.img = `http://img.youtube.com/vi/${code}/mqdefault.jpg`;
      return video;
    }
  });
  videos = videos.filter(v => !!v);
  res.render("review", { videos, images });
};

module.exports.getList = (req, res) => {
  res.render("review");
};
module.exports.addVideo = async (req, res) => {
  req.body.iframe;
  let vr = new VideoReviewModel({
    title: req.body.title,
    iframe: req.body.iframe
  });
  await vr.save();
  res.redirect("/reviews/add/video");
};
module.exports.addImage = (req, res) => {
  res.render("review");
};
