const express = require('express');
const router = express.Router(); // Create a new router
const passport = require('passport');
require('dotenv').config();

/**
 * @description This function handles Google authentication using Passport.js. 
 * It requests the user's profile and email as scope.
 * @param {string} title The title of the route.
 * @param {string} description The description of the route.
 * @returns {Object} The result of running the Google authentication query. 
 * If authentication is successful, a user object is returned. 
 * In case of an error, an error object is returned.
 */
router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email'],
  })
);


/**
 * @description This function handles the Google authentication callback using Passport.js.
 * It checks the user-agent of the request to determine if the client is a mobile device or a web browser.
 * Depending on the client type and the environment (development or production), it redirects to the appropriate URL with the user data.
 * @param {string} title The title of the route.
 * @param {string} description The description of the route.
 * @returns {Object} The result of running the Google authentication callback. 
 * If authentication is successful, a redirection response is returned with the user data in the query string. 
 * In case of an error, a redirection to the Google authentication page is returned.
 */
router.get(
  '/google/callback',
  passport.authenticate('google', { session: true, failureRedirect: '/auth/google' }),
  (req, res) => {
    const userAgent = req.headers['user-agent'];
    console.log('Agent: ' + userAgent);

    let isMobile = false;
    //Searching if its a mobile
    const mobileIdentifiers = ['mobile', 'android'];
    mobileIdentifiers.forEach((identifier) => {
      if (userAgent.toLowerCase().includes(identifier)) {
        isMobile = true;
      }
    });

    //Returning some needed data and redirecting
    const userData = encodeURIComponent(JSON.stringify(req.user));
    if (isMobile) {
      res.redirect('/?user=' + userData);
    } else {
      //We distinguish between development and production
      if (process.env.MODE_ENV === 'development') {
        res.redirect('http://localhost:3000/signin?user=' + userData);
      } else {
        res.redirect('https://wealthwars.games/signin?user=' + userData);
      }
    }
  }
);

module.exports = router; // Export the router
