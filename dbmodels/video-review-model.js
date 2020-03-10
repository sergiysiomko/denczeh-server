var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var VideoReviewShema = new Schema({
  title: String,
  code: String
});
module.exports = mongoose.model("VideoReview", VideoReviewShema);
