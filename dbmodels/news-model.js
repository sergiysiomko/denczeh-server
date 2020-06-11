var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var NewsSchema = new Schema({
  title: String,
  faceImage: String,
  bigDescription: String,
  images: [String],
  link: {
    type: String,
    unique: true,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  videocode: String,
});
module.exports = mongoose.model("News", NewsSchema);
