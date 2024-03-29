const express = require('express');
const Game = require('../middleware/game');
const socket = require('socket.io')();
const router = express.Router();
const checkAuthenticated = require('../middleware/authGoogle');
// Route to create a room game, user needs to be authenticated
router.post('/create',checkAuthenticated, async (req, res) => {
  // Take the player from de body
  const player = req.body.player;

  //Check first if the user is in another game

  // Create a new game
  const room = Math.random().toString(36).substring(2, 8).toUpperCase();
  socket.emit('createRoom', room);

  // Return to the user the code
  res.json({ code: Game.rooms.get(room) });
});

module.exports = router;
