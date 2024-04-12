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

  return 'Sala creada con éxito';
}

//Joins a room, returns events in diferent situations
function joinRoom(emailToSocket, socket, user, code) {
  // Check if the room exists
  const roomExists = rooms.has(Number(code));
  if (roomExists) {
    const playersInRoom = rooms.get(Number(code));
    const firstPlayerInRoom = Array.from(playersInRoom)[0];
    const firstPlayerDetails = sids.get(firstPlayerInRoom);
    if (firstPlayerDetails && Number(firstPlayerDetails.code) === Number(code) && playersInRoom.size < 4) {
      // Add the user email to connected players for the game
      playersInRoom.add(user.email);
      rooms.set(Number(code), playersInRoom);
      sids.set(user.email, {code: Number(code)});

      console.log(`Player ${user.name} joined room woth code ${code}`);
      socketEmit(socket, 'roomAccess', code);

      let players = getUsersWithCode(code);
      sendToAllWithCode(emailToSocket, code, 'playerJoined', user.name);
      sendToAllWithCode(emailToSocket, code, 'connectedPlayers', players);
    } else {
      console.log(`Player ${user.name} could not join room with code ${code}`);
      socketEmit(socket, 'roomJoinError', code);
    }
    console.log("Jugadores " + playersInRoom.size);
  } else {
    console.log(`Room with code ${code} does not exist`);
    socketEmit(socket, 'nonExistingRoom', code)
  }
  console.log("EN JOIN:");
  console.log([...rooms.entries()].map(([room, sockets]) => `${room}: ${[...sockets].join(', ')}`));
}

// Function that starts a game 
function startGame(emailToSocket, code) {
  let usersWithCode = getUsersWithCode(code);
  if (usersWithCode.length > 1) {
    sendToAllWithCode(emailToSocket, code, 'gameStarting',code);
    console.log(`Game starting in room with code ${code}`);
  } else {
    console.log(`No players in room with code ${code}`);
  }
}

// Function to leave a room
function leaveRoom(emailToSocket, user) {
  const userEntry = sids.get(user.email);
  //We check if user has a room asigned
  if (userEntry) {
    let code = Number(userEntry.code);
    rooms.get(code).delete(user.email);
    sids.delete(user.email);
    console.log(`Jugador ${user.email} abandonó la sala ${code}`);
    sendToAllWithCode(emailToSocket, code, 'playerLeftRoom', user.name);
  }
}


// Send a message to a specific user
function socketEmit(socket, event, data) {
  console.log(`Emitiendo evento ${event} con código ${data} a ${socket.id}`);
  socket.emit(event, data);
}


//Given a code it sends a message containing event to all the players that used that code
function sendToAllWithCode(emailToSocket, code, event, data) {
  let usersWithCode = getUsersWithCode(Number(code));
    usersWithCode.forEach((email) => {
      console.log("Emails: " + email);
      sendingThroughEmail(emailToSocket, email, event,data);
    });
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
