const Vacancies = require("../dbmodels/vacancy-model");
const News = require("../dbmodels/news-model");
const { rus_to_latin, getVideocode, render } = require("./utils");

function root(req, res) {
  News.find({}, (err, news) => {
    news.reverse();
    render(req, res, "news/news", { news });
  });
}
function getNewsPage(req, res) {
  const { link } = req.params;
  News.findOne({ link }, (error, news) => {
    if (error) {
      res.render("error", { error });
    }
    render(req, res, "news/news-page", { news });
  });
}
async function addNews(req, res) {
  try {
    let images = req.files["images"];
    req.body.images = images ? images.map((img) => img.location) : [];

    let faceImage = req.files["faceImage"];
    req.body.faceImage = faceImage ? req.files["faceImage"][0].location : "";

    req.body.link = req.body.link || rus_to_latin(req.body.title);

    // youtube code
    let { youtube } = req.body;
    req.body.videocode = getVideocode(youtube);

    let newNews = new News(req.body);
    await newNews.save();
    res.redirect("/news/list");
  } catch (error) {
    res.render("error", { error });
  }
}
function removeNews(req, res) {
  const { id } = req.params;
  News.deleteOne({ _id: id }, (err) => {
    res.render("news/news-list");
  });
}
async function editNews(req, res) {
  try {
    const { id } = req.params;
    let news = await News.findById(id);

    // images
    let faceImage = null;
    if (req.files["faceImage"]) {
      faceImage = req.files["faceImage"][0].location;
    }
    if (req.files.images) {
      news.images = req.files["images"].map((img) => img.location);
    }

    // youtube
    let { youtube } = req.body;
    req.body.youtube = undefined;
    const videocode = getVideocode(youtube);

    // fields
    news.title = req.body.title;
    news.videocode = videocode;
    news.bigDescription = req.body.bigDescription;
    news.faceImage = faceImage || news.faceImage;

    await news.save();
    res.redirect("/news/list");
  } catch (err) {
    console.log(err);
    res.redirect("/news/list");
  }
}
function addNewsPage(req, res) {
  res.render("news/add-news");
}
function editNewsPage(req, res) {
  const { id } = req.params;
  News.findById(id, (error, news) => {
    if (error) {
      res.render("error", { error });
    }

    res.render("news/edit-news", { news });
  });
}
async function newsList(req, res) {
  let news = await News.find({});
  res.render("news/news-list", { news });
}

module.exports = {
  root,
  getNewsPage,
  addNews,
  removeNews,
  editNews,
  addNewsPage,
  editNewsPage,
  newsList,
};
