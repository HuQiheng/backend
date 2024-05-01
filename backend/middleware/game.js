const AchievementController = require('../controllers/ObtainsController')
// Game.js
// Sets rooms set has all the rooms created, sids has in every room the users
//that are in that room
const sids = new Map();
const rooms = new Map();

//A state of the map in a room
const roomState = new Map();

//Game functions needed
const {
  assignTerritories,
  nextPhase,
  moveTroops,
  attackTerritories,
  surrender,
  nextTurn,
  buyActives,
  updateRanking,
} = require('../territories/Territories');
const data = require('../territories/territories.json');

// Number of victories for each player
const victories = new Map();

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
  sids.set(user.email, { code });
  console.log(`Jugador ${user.name} creó una sala con código de acceso ${code}`);
  socketEmit(socket, 'accessCode', code);

  return 'Sala creada con éxito';
}

//Joins a room, returns events in diferent situations
async function joinRoom(emailToSocket, socket, user, code) {
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
      sids.set(user.email, { code: Number(code) });

      console.log(`Player ${user.name} joined room with code ${code}`);
      socketEmit(socket, 'roomAccess', code);

      let players = getUsersWithCode(code);
      let usersInfo = await getUsersInfo(players);
      sendToAllWithCode(emailToSocket, code, 'playerJoined', user.name);
      sendToAllWithCode(emailToSocket, code, 'connectedPlayers', usersInfo);
      console.log(usersInfo);
    } else {
      console.log(`Player ${user.name} could not join room with code ${code}`);
      socketEmit(socket, 'roomJoinError', code);
    }
    console.log('Jugadores ' + playersInRoom.size);
  } else {
    console.log(`Room with code ${code} does not exist`);
    socketEmit(socket, 'nonExistingRoom', code);
  }
  console.log('EN JOIN:');
  console.log([...rooms.entries()].map(([room, sockets]) => `${room}: ${[...sockets].join(', ')}`));
}

// Function that starts a game
async function startGame(emailToSocket, code) {
  let usersWithCode = getUsersWithCode(code);
  let usersInfo = await getUsersInfo(usersWithCode);
  if (usersWithCode.length > 1) {
    sendToAllWithCode(emailToSocket, code, 'gameStarting', code);
    console.log(`Game starting in room with code ${code}`);
    //console.log(usersInfo)
    const assginment = assignTerritories(usersInfo, data);
    roomState.set(Number(code), assginment);
    console.log(roomState.get(Number(code)));
    sendToAllWithCode(emailToSocket, code, 'mapSent', assginment);

    // First game? -> unlocks an achievement
    for (let user of usersInfo) {
      const achievementTitle = 'Bienvenido a WealthWars';
      const achievementUnlocked = await AchievementController.hasAchievement(achievementTitle, user.email);
      if (!achievementUnlocked) {
        victories.set(user.email, 0);
        await AchievementController.insert(achievementTitle, user.email)
        sendingThroughEmail(emailToSocket, user.email, 'achievementUnlocked', achievementTitle);
      }
    }
  } else {
    console.log(`No players in room with code ${code}`);
  }
}

// Function to leave a room
async function leaveRoom(emailToSocket, user) {
  const userEntry = sids.get(user.email);
  //We check if user has a room asigned
  if (userEntry) {
    let code = Number(userEntry.code);
    
    rooms.get(code).delete(user.email);
    sids.delete(user.email);
    console.log(`Jugador ${user.email} abandonó la sala ${code}`);
    sendToAllWithCode(emailToSocket, code, 'playerLeftRoom', user.name);
    let players = getUsersWithCode(code);
    let usersInfo = await getUsersInfo(players);
    sendToAllWithCode(emailToSocket, code, 'connectedPlayers', usersInfo);
  }
}

function nextPhaseHandler(socket, emailToSocket, user) {
  //Check if the user is in the room
  if (sids.has(user.email)) {
    let userCode = sids.get(user.email).code;
    console.log(userCode);
    console.log(roomState);

    //Next phase for the user
    const assginment = nextPhase(roomState.get(userCode));
    console.log(assginment);
    roomState.set(userCode, assginment);
    //socketEmit(socket, 'nextPhase', user.email);
    //sendToAllWithCode(emailToSocket, userCode, 'mapSent', assginment);
    sendToAllWithCode(emailToSocket, userCode, 'nextPhase', ' ');
  } else {
    console.log(`You are not in a Room  ` + user.email);
    socketEmit(socket, 'notInARoom', userCode);
  }
}

async function nextTurnHandler(socket, emailToSocket, user) {
  //Check if the user is in the room
  if (sids.has(user.email)) {
    let userCode = sids.get(user.email).code;
    console.log(userCode);

    //Next stat for the user
    const assginment = nextTurn(roomState.get(userCode));
    roomState.set(userCode, assginment);

    console.log(assginment);
    sendToAllWithCode(emailToSocket, userCode, 'mapSent', assginment);
    sendToAllWithCode(emailToSocket, userCode, 'nextTurn', ' ');
    const playerIndex = roomState.get(userCode).players.findIndex((p) => p.email.trim() === user.email.trim());
    // Si llega a las 1000 monedas, desbloquea un logro
    if(assginment.players[playerIndex].coins >= 1000) {
      const achievementTitle = 'Mileurista';
      const achievementUnlocked = await AchievementController.hasAchievement(achievementTitle, user.email);
      if (!achievementUnlocked) {
        await AchievementController.insert(achievementTitle, user.email);
        sendingThroughEmail(emailToSocket, user.email, 'achievementUnlocked', achievementTitle);
      }
    }
  } else {
    console.log(`You are not in a Room  ` + user.email);
    socketEmit(socket, 'notInARoom', userCode);
  }
}

async function moveTroopsHandler(socket, emailToSocket, user, from, to, troops) {
  const room = sids.get(user.email);

  //Check if the user is in the room
  if (room && room.code) {
    //Next phase for the user
    const assginment = moveTroops(roomState.get(room.code), from, to, troops, user.email);
    console.log(assginment);
    roomState.set(room.code, assginment);
    sendToAllWithCode(emailToSocket, room.code, 'mapSent', assginment);
    
    //99 troops in a territory unlocks you an achievement
    if (assginment.map[to].troops === 99) {
      const achievementTitle = 'La Armada Invencible';
      const achievementUnlocked = await AchievementController.hasAchievement(achievementTitle, user.email);
      if (!achievementUnlocked) {
        await AchievementController.insert(achievementTitle, user.email);
        sendingThroughEmail(emailToSocket, user.email, 'achievementUnlocked', achievementTitle);
      }
    }
  } else {
    console.log(`You are not in the room ${room.code} ` + user.email);
    socketEmit(socket, 'notInTheRoom', room.code);
  }
}

async function attackTerritoriesHandler(socket, emailToSocket, user, from, to, troops) {
  const room = sids.get(user.email);

  //Check if the user is in the room
  if (room && room.code) {
    
    //Next phase for the user
    const {assginment ,conquered, win, winner} = attackTerritories(roomState.get(room.code), from, to, troops, user.email);
    console.log(assginment);
    roomState.set(room.code, assginment);
    sendToAllWithCode(emailToSocket, room.code, 'mapSent', assginment);
    const playerIndex = roomState.get(room.code).players.findIndex((p) => p.email.trim() === user.email.trim());
    let factories = 0;
    for(let i=0;i<assginment.map.length;i++){
      if(assginment.map[i].factories === 1 && assginment.map[i].player === playerIndex){
        factories++;
      }
      if(factories === 15) {
        const achievementTitle = 'Revolución industrial';
        const achievementUnlocked = await AchievementController.hasAchievement(achievementTitle, user.email);
        if (!achievementUnlocked) {
          await AchievementController.insert(achievementTitle, user.email);
          sendingThroughEmail(emailToSocket, user.email, 'achievementUnlocked', achievementTitle);
        }
        break;
      }
    }
    if (conquered) {
      const achievementTitle = 'Conquistador';
      const achievementUnlocked = await AchievementController.hasAchievement(achievementTitle, user.email);
      if (!achievementUnlocked) {
        await AchievementController.insert(achievementTitle, user.email);
        sendingThroughEmail(emailToSocket, user.email, 'achievementUnlocked', achievementTitle);
      }
    }
    if (win) {
      //User won send event to all
      victoryHandler(emailToSocket, winner);

      //See if user unlocked Comandante principiante achievement
      const achievementTitle = 'Comandante principiante';
      const firstVictoryUnlocked = await AchievementController.hasAchievement(achievementTitle, user.email);
      if (!firstVictoryUnlocked) {
        if(victories.has(user.email)) {
          victories.set(user.email, victories.get(user.email) + 1);
        } else {
          victories.set(user.email, 1);
        }
        await AchievementController.insert(achievementTitle, user.email);
        sendingThroughEmail(emailToSocket, user.email, 'achievementUnlocked', achievementTitle);
      }

      if(victories.has(user.email)) {
        victories.set(user.email, victories.get(user.email) + 1);
        if (victories.get(user.email) === 10) {
          const achievementTitle = 'Comandante experimentado';
          const achievementUnlocked = await AchievementController.hasAchievement(achievementTitle, user.email);
          if (!achievementUnlocked) {
            await AchievementController.insert(achievementTitle, user.email);
            sendingThroughEmail(emailToSocket, user.email, 'achievementUnlocked', achievementTitle);
          }
        }
        if(victories.get(user.email) === 100) {
          const achievementTitle = 'Comandante veterano';
          const achievementUnlocked = await AchievementController.hasAchievement(achievementTitle, user.email);
          if (!achievementUnlocked) {
            await AchievementController.insert(achievementTitle, user.email);
            sendingThroughEmail(emailToSocket, user.email, 'achievementUnlocked', achievementTitle);
          }
        }
      }
      else {
        victories.set(user.email, 1);
      }
    } 
  } else {
    console.log(`You are not in the room ${room.code} ` + user.email);
    socketEmit(socket, 'notInTheRoom', room.code);
  }
}

function surrenderHandler(socket, emailToSocket, user) {
  //Check if the user is in the room
  if (sids.has(user.email)) {
    let userCode = sids.get(user.email).code;
    console.log(userCode);

    const {state, winner, playerWinner} = surrender(roomState.get(userCode), user.email);
    console.log(state);

    //A user that surrenders leaves the room
    leaveRoom(emailToSocket, user);

    sendToAllWithCode(emailToSocket, userCode, 'mapSent', state);
    sendToAllWithCode(emailToSocket, userCode, 'userSurrendered', user.email);
    socketEmit(socket, 'youSurrendered', userCode);

    console.log("HAY GANADOR ");
    console.log(winner);
    if(winner) {
      victoryHandler(emailToSocket, playerWinner);
    }
  } else {
    console.log(`You are not in a Room  ` + user.email);
    socketEmit(socket, 'notInARoom', ' ');
  }
}

async function buyActivesHandler(socket, emailToSocket, user, type, territory, numActives) {

  //Check if the user is in the room
  if (sids.has(user.email)) {
    let userCode = sids.get(user.email).code;

    console.log("Codigo en buy actives");
    console.log(userCode);
    //Next phase for the user
    const assginment = buyActives(roomState.get(userCode), user.email, type, territory, Number(numActives));
    console.log(assginment);
    roomState.set(userCode, assginment);
    sendToAllWithCode(emailToSocket, userCode, 'mapSent', assginment);
    const playerIndex = assginment.players.findIndex((p) => p.email.trim() === user.email.trim());

    // If you buy your first factory, you unlock an achievement
    if(type === 'factory') {
      if(assginment.map[territory].factory === 1) {
        const achievementTitle = 'Industrializador';
        const achievementUnlocked = await AchievementController.hasAchievement(achievementTitle, user.email);
        if(!achievementUnlocked){
          await AchievementController.insert(achievementTitle, user.email);
          sendingThroughEmail(emailToSocket, user.email, 'achievementUnlocked', achievementTitle);
        }
      }
      let factories = 0;
      for(let i=0;i<assginment.map.length;i++){
        if(assginment.map[i].factory === 1 && assginment.map[i].player === playerIndex){
          factories++;
        }
        if(factories === 15) {
          const achievementTitle = 'Revolución industrial';
          const achievementUnlocked = await AchievementController.hasAchievement(achievementTitle, user.email);
          if (!achievementUnlocked) {
            await AchievementController.insert(achievementTitle, user.email);
            sendingThroughEmail(emailToSocket, user.email, 'achievementUnlocked', achievementTitle);
          }
          break;
        }
      }
    }

    //99 troops in a territory unlocks you an achievement
    if (assginment.map[territory].troops === 99) {
      const achievementTitle = 'La Armada Invencible';
      const achievementUnlocked = await AchievementController.hasAchievement(achievementTitle, user.email);
      if (!achievementUnlocked) {
        await AchievementController.insert(achievementTitle, user.email);
        sendingThroughEmail(emailToSocket, user.email, 'achievementUnlocked', achievementTitle);
      }
    }
  } else {
    console.log(`You are not in a room ` + user.email);
    socketEmit(socket, 'notInARoom', user.email);
  }
}

async function victoryHandler(emailToSocket, user) {
  if (sids.has(user.email)) {
    let userCode = sids.get(user.email).code;
    let rank = updateRanking(roomState.get(userCode));
    // Emit victory event to the winning player
    sendingThroughEmail(emailToSocket, user.email, 'victory', `Congratulations, ${user.name}! You have won the game! `);
    // Emit game over to all the rest of users
    sendToAllWithCode(emailToSocket, userCode, 'gameOver', {message: `Game over, ${user.name} has won the game!`, ranking: rank});

    // Añadir game a la base de datos

    const achievementTitle = 'Comandante principiante';
    const achievementUnlocked = await AchievementController.hasAchievement(achievementTitle, user.email);
    if (!achievementUnlocked) {
      if(victories.has(user.email)) {
        victories.set(user.email, victories.get(user.email) + 1);
      } else {
        victories.set(user.email, 1);
      }
      await AchievementController.insert(achievementTitle, user.email);
      sendingThroughEmail(emailToSocket, user.email, 'achievementUnlocked', achievementTitle);
    }
    if(victories.has(user.email)) {
      victories.set(user.email, victories.get(user.email) + 1);
      if (victories.get(user.email) === 10) {
        const achievementTitle = 'Comandante experimentado';
        const achievementUnlocked = await AchievementController.hasAchievement(achievementTitle, user.email);
        if (!achievementUnlocked) {
          await AchievementController.insert(achievementTitle, user.email);
          sendingThroughEmail(emailToSocket, user.email, 'achievementUnlocked', achievementTitle);
        }
      }
      if(victories.get(user.email) === 100) {
        const achievementTitle = 'Comandante veterano';
        const achievementUnlocked = await AchievementController.hasAchievement(achievementTitle, user.email);
        if (!achievementUnlocked) {
          await AchievementController.insert(achievementTitle, user.email);
          sendingThroughEmail(emailToSocket, user.email, 'achievementUnlocked', achievementTitle);
        }
      }
    }
    else {
      victories.set(user.email, 1);
    }
  } else {
    console.log(`You are not in a room ` + user.email);
  }
  
}


//Given a user it sends the map to the user of the party that he is in
function getMap(socket, user) {
  //Check if the user is in the room
  if(sids.has(user.email)) {
    let userCode = sids.get(user.email).code;
    console.log(userCode);

    const assginment = roomState.get(userCode);

    socketEmit(socket, 'mapSent', assginment);
  }
}

//Function distributed chat
function chat(socket, emailToSocket, user, message) {
  //Check if the user is in the room
  if (sids.has(user.email)) {
    let userCode = sids.get(user.email).code;
    console.log("message to be sent");
    console.log(message);
    sendToAllWithCode(emailToSocket, userCode, 'messageReceived', { message, user: user.email });
  } else {
    console.log(`You are not in a Room  ` + user.email);
    socketEmit(socket, 'notInARoom', user.email);
  }
}

// Invite someone to a game 
function invite(socket, emailToSocket, user, friendEmail) {
  if (sids.has(user.email)) {
    let userCode = sids.get(user.email).code;
    console.log(userCode);
    console.log(friendEmail);

    const userInfo = {email: user.email, name: user.name, picture: user.picture}
    console.log(user);
    console.log(userInfo);
    sendingThroughEmail(emailToSocket, friendEmail, 'invitationRecevied', {userCode, userInfo});
  } else {
    console.log(`You are not in a Room  ` + user.email);
    socketEmit(socket, 'notInARoom', user.email);
  }
}

// Send a message to a specific user
function socketEmit(socket, event, data) {
  console.log(`Emitiendo evento ${event} con valores ${JSON.stringify(data)} a ${socket.id}`);
  socket.emit(event, data);
}

//Given a code it sends a message containing event to all the players that used that code
function sendToAllWithCode(emailToSocket, code, event, data) {
  let usersWithCode = getUsersWithCode(Number(code));
  usersWithCode.forEach((email) => {
    console.log('Emails: ' + email);
    sendingThroughEmail(emailToSocket, email, event, data);
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
    if (Number(userCode.code) === code) {
      // ensure userCode.code is a number
      users.push(email);
    }
  }
  return users;
}

const playerController = require('../controllers/PlayerController');
async function getUsersInfo(usersWithCode) {
  try {
    // Create an array of promises for each user
    const promises = Array.from(usersWithCode.values()).map((email) => playerController.selectPlayer(email));

    // Use Promise.all to execute all promises in parallel
    const queryResults = await Promise.all(promises);

    // Extract only the user object from each query result
    const usersInfo = queryResults.map((result) => result.rows[0]);

    return usersInfo;
  } catch (error) {
    throw error;
  }
}




module.exports = {
  createRoom,
  joinRoom,
  leaveRoom,
  startGame,
  rooms,
  nextPhaseHandler,
  nextTurnHandler,
  moveTroopsHandler,
  attackTerritoriesHandler,
  surrenderHandler,
  buyActivesHandler,
  victoryHandler,
  getMap,
  chat,
  invite,
};
