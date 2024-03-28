const express = require('express');
const router = express.Router(); // Create a new router
const passport = require('passport')
require('dotenv').config();


//Use google strategy as middleware
router.get('/google', passport.authenticate("google",{
  scope: "profile",
}));

router.get('/google/callback', 
  passport.authenticate("google", {session: true, scope: ['email','profile']}), (req,res) =>{
    res.send(req.token);
});
module.exports = router; // Export the router