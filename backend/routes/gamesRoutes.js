const express = require('express');
const { createRoom } = require('../middleware/game'); // Importa la función createRoom
const router = express.Router();
const checkAuthenticated = require('../middleware/authGoogle');

router.post('/games', checkAuthenticated, async (req, res) => {
  // const player = req.body.player;

  // Obtén el socketId de la sesión
  const socketId = req.session.socketId;
  console.log(`Jugador ${socketId} creando una nueva sala`);
  // Crea una nueva sala
  const room = Math.random().toString(36).substring(2, 8).toUpperCase();

  // Crea la sala y obtén el código de acceso
  const code = createRoom(socketId, room);

  // Devuelve el código al jugador
  res.json({ code: code });
});

module.exports = router;