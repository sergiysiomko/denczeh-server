var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var ImageReviewShema = new Schema({
  title: String,
  src: String
});
module.exports = mongoose.model("ImageReview", ImageReviewShema);
