const express = require('express');
const { OAuth2Client } = require('google-auth-library');
const PlayerDAO = require('./DAO_VO/PlayerDAO');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

app.post('/auth', async (req, res) => {
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
      id: payload.sub,
      name: payload.name,
      email: payload.email,
      image: payload.picture,
    };
    if (PlayerDAO.select(userInfo.email) == null) {
      PlayerDAO.insert(userInfo.email, userInfo.name, userInfo.id);
    }
    req.session.userId = userInfo.id;
    req.session.save(() => {
      res.send(userInfo);
    });
  } catch (error) {
    console.error('Error verifying token', error);
    res.status(401).send('Invalid token');
  }
});
app.listen(port, () => {});
