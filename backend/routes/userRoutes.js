const express = require('express');
const router = express.Router();
const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID); // replace with your Client ID

// Your database functions
const { selectPlayer, insertPlayer } = require('../controllers/PlayerController');

router.post('/auth', async (req, res) => {
  const token = req.body.token;
  let ticket;

  try {
    ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
  } catch (error) {
    return res.status(401).send('Token verification failed');
  }

  const payload = ticket.getPayload();
  const email = payload['email'];
  const name = payload['name'];

  let user = await selectPlayer(email);

  if (!user) {
    // Assuming you want to use the email as the username and password
    user = await insertPlayer(email, name, email);
  }

  // Create JWT
  const jwtToken = jwt.sign({ email: user.email, name: user.name }, 'your-secret-key'); // replace 'your-secret-key' with your actual secret key

  res.json({ token: jwtToken });
});

module.exports = router;
