// Game.js
// Genero los conjuntos
const sids = new Map();
const rooms = new Map();

// Creates a room and returns a unique code to join it
function createRoom(socket, user, room) {
  if (rooms.has(room)) {
    return 'Error: La sala ya existe';
  }
  //We create a new room
  rooms.set(room, new Set());
  rooms.get(room).add(user.email);

  const code = 3;
  
  //A user can only connect to a room simultaneously
  sids.set(user.email, { room, code });
  console.log(`Jugador ${user.name} creó la sala ${room} con código de acceso ${code}`);


  socketEmit(socket, 'Access code', code);
 // socketBroadcastToOthers(socketId, 'Sala creada', room, code);

 console.log("EN CREATE: ");
 console.log([...rooms.entries()].map(([room, sockets]) => `${room}: ${[...sockets].join(', ')}`));
  return 'Sala creada con éxito';
}

// Function to join an existing Room
function joinRoom(socket, user, room, code) {
  console.log("EN JOIN:");
  console.log([...rooms.entries()].map(([room, sockets]) => `${room}: ${[...sockets].join(', ')}`));
  // Check if the room exists
  const roomExists = rooms.has(room);
  if (roomExists) {
    const playersInRoom = rooms.get(room);
    const firstPlayerInRoom = Array.from(playersInRoom)[0];
    const firstPlayerDetails = sids.get(firstPlayerInRoom);
    console.log("Jugador: " + firstPlayerDetails);
    console.log("Codigo   " + firstPlayerDetails.code);
    console.log("Codigo proprocinado " + code);
    console.log("Jugadores " + playersInRoom.size);
    if (firstPlayerDetails && Number(firstPlayerDetails.code) === Number(code) && playersInRoom.size < 4) {
      // Add the user email to connected playeers for the game
      playersInRoom.add(user.email);
      rooms.set(room, playersInRoom);
      sids.set(user.email, { room, code });

      console.log(`Player ${user.name} joined room ${room}`);
      socketEmit(socket, 'Room access', room);
      socketBroadcastToRoom(socket, 'Player joined', room, code);
      
      // Notify players in the room
      const playersList = Array.from(playersInRoom);
      socketBroadcastToRoom(socket, 'Connected players', room, playersList);
    } else {
      console.log(`Player ${user.name} could not join room ${room}`);
      socketEmit(socket, 'Room join error', room);
    }
  } else {
    console.log(`Room ${room} does not exist`);
  }
}


// Function that starts a game 
function startGame(emailToSocket, room) {
  const playersInRoom = rooms.get(room);
  
  if (playersInRoom) {
    playersInRoom.forEach((email) => {
      sendingThroughEmail(emailToSocket, email, 'game starting',room);
    });
    console.log(`Game starting in room ${room}`);
  } else {
    console.log(`No players in room ${room}`);
  }
}

// Función para salir de una sala
function leaveRoom(socket, user) {
  const userEntry = sids.get(user.email);

  //We check if user has a room asigned
  if (userEntry) {
    rooms.get(userEntry.room).delete(user.email);
    sids.delete(user.email);
    console.log(`Jugador ${user.email} abandonó la sala ${userEntry.room}`);
    socketBroadcastToRoom(socket, 'Player left room', userEntry.room, user.name);
  }
}

// Send a message to all users in a room, note: doesnt send to itself
function socketBroadcastToRoom(socket, event, room, data) {
  socket.to(room).emit(event,data)
}

// Send a message to a specific user
function socketEmit(socket, event, data) {
  console.log(`Emitiendo evento ${event} con código ${data} a ${socket.id}`);

  socket.emit(event, data);
}

// Envio de mensajes a todos los sockets de la sala
function socketBroadcast(io,socketId, event, room, data, players) {
  rooms.get(room).forEach((sid) => {
      emit(io,sid, event, room, data, players);
  });
}

function emit(io,socket, event, room, data, players) {
  console.log(`Emitiendo evento ${event} a la sala ${room}: ${players} con código ${data} a ${socketId}`);
  socket.emit(event, data, players);
}


// Given an email it emits an event to the corresponding socket
function sendingThroughEmail(emailToSocket, user, event, data) {
  const socket = emailToSocket.get(user);
  if (socket) {
    socket.emit(event, data);
  } else {
    console.log(`No socket found for email ${user.email}`);
  }
}

module.exports = { createRoom, joinRoom, leaveRoom, startGame, rooms};
