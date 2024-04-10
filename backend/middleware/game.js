// Game.js
// Sets rooms set has all the rooms created, sids has in every room the users
//that are in that room
const sids = new Map();
const rooms = new Map();

// Creates a room and returns a unique code to join it
function createRoom(socket, user) {
  //We create a new room
  
  let code;
  do {
    code = Math.floor(Math.random() * 10000); // generates a random number between 0 and 9999
  } while (rooms.has(code)); // continues generating a new code until it's unique
  rooms.set(code, new Set());
  rooms.get(code).add(user.email);
  //A user can only connect to a room simultaneously
  sids.set(user.email, {code});
  console.log(`Jugador ${user.name} creó una sala con código de acceso ${code}`);


  socketEmit(socket, 'accessCode', code);

 console.log("EN CREATE: ");
 console.log([...rooms.entries()].map(([room, sockets]) => `${room}: ${[...sockets].join(', ')}`));
  return 'Sala creada con éxito';
}

// Function to join an existing Room
function joinRoom(socket, user, code) {
  console.log("EN JOIN:");
  console.log([...rooms.entries()].map(([room, sockets]) => `${room}: ${[...sockets].join(', ')}`));
  // Check if the room exists
  const roomExists = rooms.has(Number(code));
  console.log("Existe? " + roomExists)
  if (roomExists) {
    const playersInRoom = rooms.get(Number(code));
    const firstPlayerInRoom = Array.from(playersInRoom)[0];
    const firstPlayerDetails = sids.get(firstPlayerInRoom);
    console.log("Jugador: " + firstPlayerDetails);
    console.log("Codigo   " + firstPlayerDetails.code);
    console.log("Codigo proprocinado " + code);
    console.log("Jugadores " + playersInRoom.size);
    if (firstPlayerDetails && Number(firstPlayerDetails.code) === Number(code) && playersInRoom.size < 4) {
      // Add the user email to connected playeers for the game
      playersInRoom.add(user.email);
      rooms.set(code, playersInRoom);
      sids.set(user.email, {code});

      console.log(`Player ${user.name} joined room woth code ${code}`);
      socketEmit(socket, 'roomAccess', code);
      socketBroadcastToRoom(socket, 'playerJoined',code, code);
      
      // Notify players in the room
      const playersList = Array.from(playersInRoom);
      socketBroadcastToRoom(socket, 'connectedPlayers', code, playersList);
    } else {
      console.log(`Player ${user.name} could not join room with code ${code}`);
      socketEmit(socket, 'roomJoinError', code);
    }
  } else {
    console.log(`Room with code ${code} does not exist`);
    socketEmit(socket, 'nonExistingRoom', code)
  }
}


// Function that starts a game 
function startGame(emailToSocket, code) {
  console.log("EN START:");
  console.log([...rooms.entries()].map(([room, sockets]) => `${room}: ${[...sockets].join(', ')}`));
  console.log(sids);

  let usersWithCode = getUsersWithCode(code);

  //const playersInRoom = rooms.get(Number(code));
  console.log("Length " + usersWithCode.length);
  console.log(usersWithCode);
  if (usersWithCode.length > 1) {
    usersWithCode.forEach((email) => {
      console.log("Emails: " + email);
      sendingThroughEmail(emailToSocket, email, 'gameStarting',code);
    });
    console.log(`Game starting in room with code ${code}`);
  } else {
    console.log(`No players in room with code ${code}`);
  }
}

// Función para salir de una sala
function leaveRoom(socket, user) {
  const userEntry = sids.get(user.email);
  //We check if user has a room asigned
  if (userEntry) {
    rooms.get(Number(userEntry.code)).delete(user.email);
    sids.delete(user.email);
    console.log(`Jugador ${user.email} abandonó la sala ${userEntry.code}`);
    socketBroadcastToRoom(socket, 'playerLeftRoom', userEntry.code, user.name);
  }
}

// Send a message to all users in a room, note: doesnt send to itself
function socketBroadcastToRoom(socket, event, room, data) {
  rooms.get(room).forEach((sid) => {
    if (sid !== socket.id) {
      socketEmit(socket, event, room);
    }
  });
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
function sendingThroughEmail(emailToSocket, email, event, data) {
  //console.log("El email to socket: ");
  //console.log(emailToSocket);
  const socket = emailToSocket.get(email);
  if (socket) {
    socket.emit(event, data);
  } else {
    console.log(`No socket found for email ${email}`);
  }
}

function getUsersWithCode(code) {
  let users = [];
  code = Number(code); // ensure code is a number
  for (let [email, userCode] of sids.entries()) {
    if (Number(userCode.code) === code) { // ensure userCode.code is a number
      users.push(email);
    }
  }
  return users;
}

module.exports = { createRoom, joinRoom, leaveRoom, startGame, rooms};
