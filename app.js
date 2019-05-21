var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
//var bodyParser = require('body-parser');
var session = require('express-session');
var favicon = require('serve-favicon');
var multer = require('multer');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var flash = require('connect-flash');
var expressValidator = require('express-validator');
var expressMessages = require('express-messages');
//var mongo = require('mongodb');
var mongoose = require('mongoose');
// mongoose.connect("mongodb://localhost/denczechdb");
// var db = mongoose.connection;
mongoose.Promise = global.Promise;
const localDbUri = "mongodb://localhost/denczechdb";
const dbUri = 'mongodb+srv://user:fsn72YISY@cluster0-eunrh.azure.mongodb.net/densitedb?retryWrites=true'
//'mongodb://densitedb:l7I44YluKtxHExSdRVjac8a81XP5WrVYdS36TUcsNzp09nG1FerlETNeFBfKUpdWQVZRp2ZkZjQxqqpWPkkaRg==@densitedb.documents.azure.com:10250/densitedb?ssl=true&sslverifycertificate=false';
//'mongodb://densitedb:l7I44YluKtxHExSdRVjac8a81XP5WrVYdS36TUcsNzp09nG1FerlETNeFBfKUpdWQVZRp2ZkZjQxqqpWPkkaRg==@densitedb.documents.azure.com:10255/?ssl=true&replicaSet=globaldb'


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
  

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/vacancies');
var infoRouter = require('./routes/info');
var anketRouter = require('./routes/anket');
var contactsRouter = require('./routes/contacts');

var app = express();
// var host = "127.0.0.1"
// var port = process.env.PORT || 80;
app.listen(1337,() => {
  console.log('Сервер запущено');
});
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// handle file uploads


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// handle session
app.use(session({
  secret:"secret",
  saveUninitialized:true,
  resave:true
}))

// passport
app.use(passport.initialize());
app.use(passport.session());

// validator
app.use(expressValidator() );

app.use(flash());
app.use(function (req, res, next) {
  res.locals.messages = expressMessages(req, res);
  next();
});


app.use('/', indexRouter);
app.use('/vacancies', usersRouter);
app.use('/info', infoRouter);
app.use('/anket',anketRouter)
app.use('/contacts',contactsRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error',{error:err});

});
module.exports = app;
