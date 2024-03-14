// Gestionar token de google auth
const express = require('express');
const { OAuth2Client } = require('google-auth-library');
require('dotenv').config();
const app = express();
app.use(express.json());


const PlayerController = require('../controllers/PlayerController');
const { validateJWT } = require('../auth/auth'); // Import validateJWT

const router = express.Router(); // Create a new router

const client = new OAuth2Client();

router.post('/auth', async (req, res) => {
  const playerInstance = new PlayerController();
  const { token } = req.body;
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    if (!payload) {
      return res.status(401).send('Invalid token');
    }
    const userInfo = {
      id: payload['sub'],
      name: payload['name'],
      email: payload['email'],
      image: payload['picture'],
    };
    const existingUser = await playerInstance.select(userInfo.email);
    if(existingUser == null) {
        await PlayerController.insert(userInfo.email, userInfo.name, userInfo.id);
    }
    req.session.userId = userInfo.id;
    req.session.save(() => {
      console.log(`User ${userInfo.name} authenticated`);
      res.send(userInfo);
    });
  } catch (error) {
    console.error('Error verifying token', error);
    res.status(401).send('Invalid token');
  }
});

router.get('/users/:myID', validateJWT, async (req, res) => { // Use validateJWT as middleware
    try {
      const playerInstance = new PlayerController();
      const userInfo = await playerInstance.select(req.params.myID);
      res.send(userInfo);
    } catch (error) {
      console.error('Error getting user info', error);
      res.status(500).send('Internal Server Error');
    }
  });
  
module.exports = router; // Export the router

