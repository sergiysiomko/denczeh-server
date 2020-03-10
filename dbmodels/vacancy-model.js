var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var VacancySchema = new Schema({
  title: String,
  payment: String,
  paymentMounth: String,
  currency: String,
  shchedule: String,
  habitation: String,
  faceImage: String,
  description: String,
  bigDescription: String,
  country: String,
  location: String,
  images: [String],
  link: {
    type: String,
    unique: true,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  category: [String],
  experience: Boolean,
  lang: Boolean
});
module.exports = mongoose.model("Vacancy", VacancySchema);
