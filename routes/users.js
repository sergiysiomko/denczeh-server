const express = require('express');
const router = express.Router();
const passport = require('passport');


router.get('/',passport.isLoggedIn,(req, res) => {
  let {login} = req.user;

  res.render('user', {login})
})

router.get('/register', function(req, res, next) {
  res.render('register')
});
router.get('/login', function(req, res, next) {
  
  res.render('login')
});
router.post('/register', passport.authenticate('local-signup', {
  successRedirect : '/', // redirect to the secure profile section
  failureRedirect : '/users/register', 
  
}));

router.post('/login',passport.authenticate('local-login',{
    successRedirect : '/',
    failureRedirect : '/users/login',
    failureFlash: true
  }
));

router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});




module.exports = router;

