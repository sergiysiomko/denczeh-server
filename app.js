const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const expressValidator = require('express-validator');

const mongoose = require('mongoose');
const secure = require('express-force-https');

mongoose.Promise = global.Promise;
const localDbUri = "mongodb://localhost/denczechdb";
const dbUri = 'mongodb+srv://user:fsn72YISY@cluster0-eunrh.azure.mongodb.net/densitedb?retryWrites=true'


// mongoose.connect(localDbUri,{
//   useNewUrlParser:true
// }).then(() => {
//     console.log("MongoDB has started...");
//   })
//   .catch((err) => {
//     //throw new Error("db crash");
//     console.log(err)
//     console.log('db crash')
//   })

mongoose.connect(dbUri,{
  useNewUrlParser:true
  //,useMongoClient:true
}).then(() => {
    console.log("MongoDB has started...");
  })
  .catch((err) => {
    //throw new Error("db crash");
    console.log(err)
    console.log('db crash')
  })
  
let routers = require('./routes/routers');

const app = express();
// var host = "127.0.0.1"
// var port = process.env.PORT || 80;
app.listen(1337,() => {
  console.log('Сервер запущено');
});
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


//app.use(secure)

//app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(expressValidator() );

app.use('/', routers)

module.exports = app;
