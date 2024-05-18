/**This module helps with the authentification strategy using passport */
/**For more information about passport check https://www.passportjs.org/concepts/authentication/oauth/ */
const passport = require('passport');

const { Strategy: GoogleStrategy } = require('passport-google-oauth20');
require('dotenv').config();
const Player = require('../controllers/PlayerController');
/**
 * Specify the passport strategy, we are using the google authentification
 * for our app
 */
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

      try {
        //Create a new object with the user info
        const user = {
          name: account.name,
          email: email,
          password: account.sub,
          picture: account.picture,
        };
        //We look if the user exists
        const query = await Player.selectPlayer(email);
        if (query.rows.length === 0) {
          //User doesnt exist --> create user
          await Player.insertPlayer(email, account.name, account.sub, account.picture);
        }
        //User exists we update their profile picture
        await Player.updatePlayerPicture(email, account.picture);
        done(null, user);
      } catch (error) {
        done(error);
      }
    }
  )
);

//Note: user is stored in req.session.passport.user.{user} use it if its needed
//With serialize and deserialize this information is attached to  req.user.{auth_user}

//Just the most simple confguration
passport.serializeUser((user, done) => {
  //console.log('Serialized user ' + JSON.stringify(user));
  done(null, user);
});

passport.deserializeUser((user, done) => {
  //console.log('Deserializad user ' + JSON.stringify(user));
  done(null, user);
});

//Middleware to check if the user is logged if it's not redirect them to the login
//This is for the express session
/**
 * @function
 * @description Check if the user is authentificated
 * @returns If its authentifcated return the action that
 * the user requested, if its not redirect them to
 * authentificate
 */
checkAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  //Redirect them to the login
  res.redirect('/auth/google');
};

module.exports = checkAuthenticated;
