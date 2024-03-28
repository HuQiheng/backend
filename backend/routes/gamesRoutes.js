const express = require('express');
const Game = require('../middleware/game');

const router = express.Router();

// Ruta para crear una sala de juego
router.post('/games', async (req, res) => {
  // Extraer el JWT del cuerpo de la solicitud
  const { jwt, player } = req.body;

  // Validar el JWT
  // Comenta las siguientes líneas si quieres deshabilitar la validación temporalmente
  /*
    const isValid = await validateJWT(jwt);
    if (!isValid) {
        return res.status(401).json({ error: 'Invalid token' });
    }
    */

  // Crear una nueva sala de juego
  const room = Math.random().toString(36).substring(2, 8).toUpperCase();
  Game.createRoom(player, room);

  // Devolver el código de la sala de juego
  res.json({ code: Game.rooms.get(room) });
});

module.exports = router;
