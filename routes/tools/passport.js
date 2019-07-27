const passport = require('passport'),
path = require('path'),
db = require(path.join(__dirname ,'db')),
LocalStrategy = require('passport-local').Strategy,
SqlString = require('sqlstring'),
bcrypt = require('bcrypt');


//passport configure
passport.use('local-login', new LocalStrategy({
    // by default, local strategy uses username and password, we will override with email
    usernameField : 'username',
    passwordField : 'password',
    passReqToCallback : true
},
function(req, username, password, done) {
    db.query(SqlString.format('SELECT * FROM users WHERE username =?',[username]),function(err,rows){
        if (err) throw err;
        if (!rows.length) {
          console.log("here");
           return done(null, false, req.flash('error', 'Something went wrong'));
        }

        // if the user is found but the password is wrong
        if (!bcrypt.compareSync(password, rows[0].password)){
          console.log("here2");
            return done(null, false, req.flash('error', 'Something went wrong'));
        }
        //req.session.cookie.maxAge = 365 * 24 * 60 * 60 * 1000;
				return done(null, rows[0]);

      });
}));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  db.query(SqlString.format("SELECT * FROM users where id =?",[id]),function(err,rows){
    done(err, rows[0]);
  });
});
