const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const expressValidator = require("express-validator");

const mongoose = require("mongoose");
const secure = require("express-force-https");

require("dotenv").config();
const passport = require("passport");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);

mongoose.Promise = global.Promise;

mongoose
  .connect(process.env.DB_CONN_STRING, {
    useNewUrlParser: true,
    useCreateIndex: true
  })
  .then(() => {
    console.log("MongoDB connected...");
  })
  .catch(err => {
    //throw new Error("db crash");
    console.log(err);
    console.log("db crash");
  });

let routers = require("./routes/routers");

const app = express();
app.listen(() => {
  console.log("Сервер запущено");
});
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

//app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(expressValidator());

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: parseInt(process.env.COOKIE_MAX_AGE) } // 2 weeks
  })
);

// passport configuration
app.use(passport.initialize());
app.use(passport.session());

app.use("/", routers);

module.exports = app;
