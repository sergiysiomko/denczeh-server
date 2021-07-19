var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CrmSchema = new Schema({
  expires_in: Number,
  access_token: String,
  refresh_token: String,
});
module.exports = mongoose.model('Crm', CrmSchema);
