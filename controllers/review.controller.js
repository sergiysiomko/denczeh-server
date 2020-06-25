const VideoReviewModel = require("../dbmodels/video-review-model");
const ImageReviewModel = require("../dbmodels/image-review-model");

module.exports.root = async (req, res) => {
  let videos = await VideoReviewModel.find({});
  let images = await ImageReviewModel.find({});

  videos.reverse();
  images.reverse();
  res.render("review/review", { videos, images, auth: req.isAuthenticated() });
};

module.exports.getList = (req, res) => {
  res.render("review/review");
};
module.exports.addVideo = async (req, res) => {
  let { link } = req.body;
  let { title } = req.body;
  let code = link.split("/").reverse()[0];

  let vr = new VideoReviewModel({
    title,
    code,
  });
  await vr.save();
  res.redirect("/reviews/add/video");
};
module.exports.addImage = (req, res) => {
  let { title } = req.body;
  let src = req.file.location;
  let ri = new ImageReviewModel({ title, src });
  ri.save(() => res.render("review/review-add-image"));
};
