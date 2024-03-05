// Gestionar token de google auth
const express = require('express');
const { OAuth2Client } = require('google-auth-library');

const app = express();
app.use(express.json());
// recibo el token de google y lo valido
app.post('/login', async (req, res) => {
  // Autenticar Usuario
  try { 
    const { email, password } = req.body;
    const isValid = await PlayerDAO.verificarCredenciales(PlayerVO);
    if (!isValid) { //creo la cuenta
      const idUsuarioNuevo = await PlayerDAO.insert()
    }
    const token = jwt.sign({ email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
    res.json({ valid: true, token });
  } catch (err) {
        res.status(500).json({ error: err.message });
    }
});





