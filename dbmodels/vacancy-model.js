var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var VacancySchema = new Schema({
    title:String,
    payment:Number,
    currency:String,
    faceImage:String,
    description:String,
    bigDescription:String,
    location:String,
    images:[String],
    link:{
        type:String,
        unique:true,
        required:true
    }
})
module.exports = mongoose.model("Vacancy",VacancySchema);