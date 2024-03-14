const express = require('express');
const {OAuth2Client} = require('google-auth-library');
const jwt = require('jsonwebtoken');
const router = express.Router(); // Create a new router
require('dotenv').config();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

router.post('/auth', async (req, res) => {
  const token = req.body.token;
  console.log('token', token);
  try {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,  // replace with your Client ID
    });
    const payload = ticket.getPayload();
    const userid = payload['sub'];
    const email = payload['email'];

    // Check if user exists
    const user = await selectPlayer(email);
    if (user.rows.length === 0) {
        // If user doesn't exist, create a new one
        const username = payload['name'];
        const password = payload['at_hash']; // or any other field you want to use as password
        await insertPlayer(email, username, password);
    }
    //genero el jwt
    const token = jwt.sign({email}, process.env.SECRET_KEY, {expiresIn: '1h'});
    return res.status(200).json({token});

    // Save session id and return response
    req.session.userId = userid;
    res.send({status: 'success', userId: userid});
  } catch (error) {
    res.status(401).send({status: 'error', error});
  }
});

/*router.get('/users/:myID', validateJWT, async (req, res) => { // Use validateJWT as middleware
    try {
      const playerInstance = new PlayerController();
      const userInfo = await playerInstance.select(req.params.myID);
      res.send(userInfo);
    } catch (error) {
      console.error('Error getting user info', error);
      res.status(500).send('Internal Server Error');
    }
  });*/
  
module.exports = router; // Export the router

