var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var ServiceShema = new Schema({
  title: String,
  description: String,
  price: String,
  term: String
});
module.exports = mongoose.model("Service", ServiceShema);
