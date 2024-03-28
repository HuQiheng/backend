const express = require('express');
const router = express.Router(); // Create a new router
const passport = require('passport')
require('dotenv').config();


//Use google strategy as middleware
//We want the user info profile and the email
router.get('/google', passport.authenticate("google",{
  scope: [
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/userinfo.email'
  ]
}));

router.get('/google/callback', 
  passport.authenticate("google", {session: true, scope: [
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/userinfo.email'
  ]}), (req,res) =>{
    res.send(req.token);
});
module.exports = router; // Export the router