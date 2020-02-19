const LocalStrategy = require('passport-local').Strategy
const Users = require('../dbmodels/user-model');
const passport = require('passport');

module.exports = (function(){



passport.serializeUser(function (user, done) {
  done(null, user.id)
})

passport.deserializeUser(function (id, done) {
  Users.findById(id, (err, user) => {
    done(err, user)
  })
})
passport.use('local-signup', new LocalStrategy({
    // by default, local strategy uses username and password, we will override with login
    usernameField : 'login',
    passwordField : 'password',
    passReqToCallback : true // allows us to pass back the entire request to the callback
  },
  function(req, login, password, done){
    process.nextTick(function() {

      // find a user whose login is the same as the forms login
      // we are checking to see if the user trying to login already exists
      Users.findOne({ 'login' :  login }, function(err, user) {
          // if there are any errors, return the error
          if (err)
              return done(err);

          // check to see if theres already a user with that login
          if (user) {
              return done(null, false);
          } else {

              // if there is no user with that login
              // create the user
              var newUser = new Users();

              // set the user's local credentials
              
              newUser.login = login;
              newUser.password = newUser.generateHash(password);

              // save the user
              newUser.save(function(err) {
                  if (err)
                      throw err;
                  return done(null, newUser);
              });
          }

        });  
      });  
  }
  ))
  passport.use('local-login', new LocalStrategy({
    // by default, local strategy uses username and password, we will override with login
    usernameField : 'login',
    passwordField : 'password',
    passReqToCallback : true // allows us to pass back the entire request to the callback
},
function(req, login, password, done) { // callback with login and password from our form

    // find a user whose login is the same as the forms login
    // we are checking to see if the user trying to login already exists
    Users.findOne({ 'login' :  login }, function(err, user) {
        // if there are any errors, return the error before anything else
        if (err)
            return done(err);
        //console.log("user",user);
        //console.log("password",password);
        // if no user is found, return the message
        if (!user)
            return done(null, false); 

        // if the user is found but the password is wrong
        if (!user.validPassword(password))
            return done(null, false); // create the loginMessage and save it to session as flashdata

        // all is well, return successful user
        return done(null, user);
    });

}));

// route middleware to make sure a user is logged in
passport.isLoggedIn = (req, res, next)=>{
    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
    return next();

    // if they aren't redirect them to the home page
    res.redirect('/admin/login');
  }
  
})()
