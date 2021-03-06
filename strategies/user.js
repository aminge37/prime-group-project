var passport = require('passport');
var localStrategy = require('passport-local').Strategy;
var encryptLib = require('../modules/encryption');
var connectionString = require('../modules/connection');
var pg = require('pg');


passport.serializeUser(function(user, done) {
  //console.log('hola');
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
//TODO SQL query
//  console.log('called deserializeUser');
  pg.connect(connectionString, function (err, client) {

    var user = {};
    //console.log('called deserializeUser - pg');
    var query = client.query("SELECT * FROM users WHERE id = $1", [id]);

    query.on('row', function (row) {
      //console.log('User row', row);
      user = row;
      done(null, user);
    });

    // After all data is returned, close connection and return results
    query.on('end', function () {
      client.end();
    });

    // Handle Errors
    if (err) {
      console.log(err);
    }
  });
});

// Does actual work of logging in
passport.use('local', new localStrategy({
  passReqToCallback: true,
  usernameField: 'email'
  }, function(req, email, password, done){
    pg.connect(connectionString, function (err, client) {
      //console.log('called local - pg');
      var user = {};
      var query = client.query("SELECT * FROM users WHERE email = $1", [email]);

      //user = query;
      //console.log('user is: ', user);

      query.on('row', function (row) {
        //console.log('User obj', row);
        user = row;

        // Hash and compare
        if (encryptLib.comparePassword(password, user.password)) {
          // all good!
          console.log('matched');
          done(null, user);
        } else {
          console.log('nope');
          done(null, false, {message: 'Incorrect credentials.'});
        }

      });

      // After all data is returned, close connection and return results
      query.on('end', function () {
        console.log('ending the stuff');
        client.end();
      });

      // Handle Errors
      if (err) {
        //console.log('yup');
        console.log(err);
      }
    });
  }
));


module.exports = passport;