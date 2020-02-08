const express = require('express');
const createError = require('http-errors');
const router = express.Router();

require('../auth');

const indexRouter = require('./index');
const vacanciesRouter = require('./vacancies');
const infoRouter = require('./info');
const anketRouter = require('./anket');
const contactsRouter = require('./contacts');
const usersRouter = require('./users');


router.use('/', indexRouter);
router.use('/vacancies', vacanciesRouter);
router.use('/info', infoRouter);
router.use('/anket', anketRouter)
router.use('/contacts', contactsRouter)
router.use('/users', usersRouter)

// catch 404 and forward to error handler
router.use(function(req, res, next) {
  next(createError(404));
});

// error handler
router.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error',{error:err});

});

module.exports = router;