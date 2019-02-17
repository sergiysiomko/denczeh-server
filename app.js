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
mongoose.connect("mongodb://localhost/denczechdb",{
  useNewUrlParser:true
})
  .then(() => {
    console.log("MongoDB has started...");
  })
  .catch((err) => {
    throw new Error("db crash");
  })
  

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/vacancies');

var app = express();
app.listen(80,"192.168.1.6",() => {
  console.log("Сервер запущено");
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
  res.render('error');
});
module.exports = app;
