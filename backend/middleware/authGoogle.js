//Requires
const passport = require('passport');
const { Strategy: GoogleStrategy } = require('passport-google-oauth20');
require('dotenv').config();
const Player = require('../controllers/PlayerController');

passport.use(
  //specify the strategy to be used
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.SECRET_KEY,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      scope: ['email', 'profile'],
    },
    async (accesToken, refreshToken, profile, done) => {
      //Accces user google profile
      const account = profile._json;
      const email = profile.emails[0].value;
      console.log('Email: ' + email);
      console.log(account);
      try {
        const user = {
          name: account.name,
          email: email,
          password: account.sub,
        };
        //We look if the user exists
        const query = await Player.selectPlayer(email);
        if (query.rows.length === 0) {
          //create user
          await Player.insertPlayer(email, account.name, account.sub);
        }
        console.log('Retunred user ' + JSON.stringify(user));
        //If the user exists no action is needed just return the user
        done(null, user);
      } catch (error) {
        done(error);
      }
    }
  )
);

//note: user is stored in req.session.passport.user.{user} use it if its needed
//With serialize and deserializa this information is attached to  req.user.{auth_user}

//Just the most simple confguration
passport.serializeUser((user, done) => {
  console.log('Serialized user ' + JSON.stringify(user));
  done(null, user);
});

passport.deserializeUser((user, done) => {
  console.log('Deserializad user ' + JSON.stringify(user));
  done(null, user);
});

//Middleware to check if the user is logged if it's not redirect them to the login
checkAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  //Redirect them to the login
  res.redirect('/auth/google');
};

module.exports = checkAuthenticated;
