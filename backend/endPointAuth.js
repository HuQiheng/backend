// Gestionar token de google auth
const express = require('express');
const { OAuth2Client } = require('google-auth-library');

const app = express();
app.use(express.json());
// recibo el token de google y lo valido
app.post('/auth', async (req, res) => {
  const { token } = req.body;
  const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.GOOGLE_CLIENT_ID,
  });
  if (!ticket.getPayload()) {
    return res.status(401).send('Invalid token');
  }
  const userInfo = ticket.getPayload();
  console.log(`User ${userInfo.name} authenticated`);
  res.json(userInfo);
});

// Ejecución del servidor en el puerto 3000
const port = process.env.PORT || 3000;  
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});





