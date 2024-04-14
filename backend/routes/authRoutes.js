const express = require('express');
const router = express.Router(); // Create a new router
const passport = require('passport');
require('dotenv').config();

//Use google strategy as middleware
//We want the user info profile and the email
router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email'],
  })
);

//This callback redirects to the correct url depending if we are on web or mobile
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
    console.log('Devuelto ' + JSON.stringify(req.user));
  }
);

module.exports = router; // Export the router
