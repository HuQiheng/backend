/**This module manage all the game logic */
const ObtainsController = require('../controllers/ObtainsController');
const PlayerController = require('../controllers/PlayerController');
const AchievementController = require('../controllers/AchievementController');

// Sets:
// rooms set has all the rooms created
// sids has the emails of the users that are in a room
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
  isPlayerTurn,
} = require('../territories/Territories');
const data = require('../territories/territories.json');

// Creates a room and returns a unique code to join it
/**
 * @description Creates a room, and join the user to the room
 * emits the event {accessCode} with the code to the user
 * @param {socket} socket
 * @param {user} user
 * @returns The result of creating the room
 */
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
  socketEmit(socket, 'accessCode', code);

  return 'Sala creada con éxito';
}

/**
 * @description The user try to join a room. It emits
 * differents events depending on the situations:
 * - User could join the room: {roomAccess} and the code
 * Also emits {connectedPlayers} with all the players in the room
 * - Can't join the room: {roomJoinError}
 * - Room doesn't exist: {nonExistingRoom}
 * @param {Set} emailToSocket
 * @param {socket} socket
 * @param {user} user
 * @param {string} code
 */
async function joinRoom(emailToSocket, socket, user, code) {
  const roomCode = Number(code);

  // Check if the room exists
  const roomExists = rooms.has(roomCode);
  if (roomExists) {
    const playersInRoom = rooms.get(roomCode);
    const firstPlayerInRoom = Array.from(playersInRoom)[0];
    const firstPlayerDetails = sids.get(firstPlayerInRoom);

    // Check if the game has started
    const gameStarted = roomState.get(roomCode);

    // Check if thera are less than 4 players in the room
    if (firstPlayerDetails && playersInRoom.size < 4 && gameStarted == null) {
      // Add the user email to connected players for the game
      playersInRoom.add(user.email);
      rooms.set(roomCode, playersInRoom);
      sids.set(user.email, { code: roomCode });

      //emit the event
      socketEmit(socket, 'roomAccess', code);

      let players = getUsersWithCode(code);
      let usersInfo = await getUsersInfo(players);
      sendToAllWithCode(emailToSocket, code, 'playerJoined', user.name);
      sendToAllWithCode(emailToSocket, code, 'connectedPlayers', usersInfo);
    } else {
      socketEmit(socket, 'roomJoinError', code);
    }
  } else {
    socketEmit(socket, 'nonExistingRoom', code);
  }
}

/**
 * @description Try to start a game, it emits
 * different events depending on the result:
 * -Game started correctly: {gameStarting} and the code
 * also sends {mapSent} with the initial map
 * Also grants the users that is their first game
 * an achievement
 * @param {Set} emailToSocket
 * @param {string} code
 */
async function startGame(emailToSocket, code) {
  let usersWithCode = getUsersWithCode(code);
  let usersInfo = await getUsersInfo(usersWithCode);
  if (usersWithCode.length > 1) {
    sendToAllWithCode(emailToSocket, code, 'gameStarting', code);

    const state = assignTerritories(usersInfo, data);
    roomState.set(Number(code), state);
    sendToAllWithCode(emailToSocket, code, 'mapSent', state);

    // First game? -> unlocks an achievement
    for (let user of usersInfo) {
      await giveAchievement(emailToSocket, 'Bienvenido a WealthWars', user.email);
    }
  }
}

// Function to leave a room
/**
 * @description It checks if the user is in a room
 * if the user is in one, the user leaves it and
 * send to all the other users that a player left the room
 * and the connected players in that room
 * @param {Set} emailToSocket
 * @param {user} user
 */
async function leaveRoom(emailToSocket, user) {
  const userEntry = sids.get(user.email);
  //We check if user has a room asigned
  if (userEntry) {
    let code = Number(userEntry.code);

    if (rooms.has(code)) {
      const room = rooms.get(code);
      if (room) {
        room.delete(user?.email);
      }
    }
    sids.delete(user.email);
    sendToAllWithCode(emailToSocket, code, 'playerLeftRoom', user.name);
    let players = getUsersWithCode(code);
    let usersInfo = await getUsersInfo(players);
    sendToAllWithCode(emailToSocket, code, 'connectedPlayers', usersInfo);
  }
}

/**
 * @description If the user is in a room and is his turn
 * it changes the game phase (not the turn), it sends all the
 * users the new map. If the user is not in a room it notify the user
 * with the event {notInARoom}
 * @param {socket} socket
 * @param {Set} emailToSocket
 * @param {user} user
 */
function nextPhaseHandler(socket, emailToSocket, user) {
  //Check if the user is in the room
  if (sids.has(user.email)) {
    let userCode = sids.get(user.email).code;

    //Next phase for the user
    const state = nextPhase(roomState.get(userCode));
    roomState.set(userCode, state);
    sendToAllWithCode(emailToSocket, userCode, 'nextPhase', ' ');
  } else {
    socketEmit(socket, 'notInARoom', ' ');
  }
}

/**
 * @description Give the turn to the next player if the user is
 * in a room and it's his turn, send to all the users the new map.
 * If the user is not in a room send him the event {notInARoom}.
 * @param {socket} socket
 * @param {Set} emailToSocket
 * @param {user} user
 */
async function nextTurnHandler(socket, emailToSocket, user) {
  //Check if the user is in the room
  if (sids.has(user.email)) {
    let userCode = sids.get(user.email).code;

    //Next turn for the game
    const state = nextTurn(roomState.get(userCode), false);
    roomState.set(userCode, state);

    sendToAllWithCode(emailToSocket, userCode, 'mapSent', state);
    sendToAllWithCode(emailToSocket, userCode, 'nextTurn', ' ');
    const playerIndex = state.players.findIndex((p) => p.email.trim() === user.email.trim());
    // If reach 1000 coins, unlock an achievement
    if (Number(state.players[playerIndex].coins) >= 1000) {
      await giveAchievement(emailToSocket, 'Mileurista', user.email);
    }
  } else {
    socketEmit(socket, 'notInARoom', ' ');
  }
}

/**
 * @description Move the number of troops {troops} from
 * the territory {from} to the territory {to}. User must be
 * in the middle of a game and both territories needs to be
 * possessed by the user.
 * @param {socket} socket
 * @param {Set} emailToSocket
 * @param {user} user
 * @param {string} from
 * @param {string} to
 * @param {Number} troops
 */
async function moveTroopsHandler(socket, emailToSocket, user, from, to, troops) {
  const room = sids.get(user.email);

  //Check if the user is in the room
  if (room && room.code) {
    //Move the troops
    const state = moveTroops(roomState.get(room.code), from, to, troops, user.email);
    roomState.set(room.code, state);
    //Send to all the new state
    sendToAllWithCode(emailToSocket, room.code, 'mapSent', state);

    //99 troops in a territory unlocks you an achievement
    if (state.map[to].troops === 99) {
      await giveAchievement(emailToSocket, 'La Armada Invencible', user.email);
    }
  } else {
    socketEmit(socket, 'notInTheRoom', room.code);
  }
}

/**
 * @description Attack the territory {to} using a
 * number of troops {troops} that are in the territory
 * {from}. User must be in the middle of a game, territory
 * {from} must be owned by them and territory {from} can't be.
 * Number of troops must be a range of troops between [1,n-1] n
 * is the number of troops in the territory {from}.
 * As a result if the user attack with more troops than the number of
 * troops in the territory {to}, the territory will be owned by them.
 * @param {socket} socket
 * @param {Set} emailToSocket
 * @param {user} user
 * @param {string} from
 * @param {string} to
 * @param {Number} troops
 */
async function attackTerritoriesHandler(socket, emailToSocket, user, from, to, troops) {
  const room = sids.get(user.email);

  //Check if the user is in the room
  if (room && room.code) {
    //Next phase for the user
    const { state, conquered, winner, player } = attackTerritories(
      roomState.get(room.code),
      from,
      to,
      troops,
      user.email
    );

    roomState.set(room.code, state);
    sendToAllWithCode(emailToSocket, room.code, 'mapSent', state);

    sendToAllWithCode(emailToSocket, room.code, 'attack', {
      email: user.email,
      from: from,
      to: to,
      numberTroops: troops,
    });
    const playerIndex = state.players.findIndex((p) => p.email.trim() === user.email.trim());
    let factories = 0;
    const map = state.map;
    for (const i in map) {
      if (map[i].factories === 1 && map[i].player === playerIndex) {
        factories++;
      }
      if (Number(factories) === 15) {
        await giveAchievement(emailToSocket, 'Revolución industrial', user.email);
        break;
      }
    }
    if (conquered) {
      await giveAchievement(emailToSocket, 'Conquistador', user.email);
    }
    if (winner) {
      //User won send event to all);
      victoryHandler(emailToSocket, user);
    }
  } else {
    socketEmit(socket, 'notInARoom', room.code);
  }
}

/**
 * @description If the user is in a game, it surrender
 * making them unable to play in the game and distributing their
 * territory among all the left users. If there are only two players
 * the player that didn't surrender wins the game
 * @param {socket} socket
 * @param {Set} emailToSocket
 * @param {user} user
 */
function surrenderHandler(socket, emailToSocket, user) {
  //Check if the user is in the room
  if (sids.has(user.email)) {
    let userCode = sids.get(user.email).code;
    if (roomState.get(userCode)) {
      //Surrender
      const { state, winner, playerWinner } = surrender(roomState.get(userCode), user.email);

      //Is the turn of the user that surrendered
      if (isPlayerTurn(state, user.email)) {
        nextTurn(state, true);
      }

      sendToAllWithCode(emailToSocket, userCode, 'mapSent', state);
      sendToAllWithCode(emailToSocket, userCode, 'userSurrendered', user.email);
      socketEmit(socket, 'youSurrendered', userCode);

      //Check if there is a winner
      if (winner) {
        victoryHandler(emailToSocket, playerWinner);
      }
    }
  } else {
    socketEmit(socket, 'notInARoom', ' ');
  }
}

/**
 * @description Buys a number of {numActives} to
 * {territory}. The {type} can 'troop' or 'factory'.
 * User has to have the number of coins to buy the actives and be
 * the owner of the territory
 * @param {socket} socket
 * @param {Set} emailToSocket
 * @param {user} user
 * @param {string} type
 * @param {string} territory
 * @param {Number} numActives
 */
async function buyActivesHandler(socket, emailToSocket, user, type, territory, numActives) {
  //Check if the user is in the room
  if (sids.has(user.email)) {
    let userCode = sids.get(user.email).code;

    //Next phase for the user
    const state = buyActives(roomState.get(userCode), user.email, type, territory, Number(numActives));

    roomState.set(userCode, state);
    sendToAllWithCode(emailToSocket, userCode, 'mapSent', state);
    const playerIndex = state.players.findIndex((p) => p.email.trim() === user.email.trim());

    // If reach 1000 coins, unlock an achievement
    if (Number(state.players[playerIndex].coins) >= 1000) {
      await giveAchievement(emailToSocket, 'Mileurista', user.email);
    }

    // If you buy your first factory, you unlock an achievement
    if (type === 'factory') {
      if (state.map[territory].factories === 1) {
        await giveAchievement(emailToSocket, 'Industrializador', user.email);
      }
      let factories = 0;
      const map = state.map;
      for (const i in map) {
        if (map[i].factories === 1 && map[i].player === playerIndex) {
          factories++;
        }
        if (Number(factories) === 15) {
          await giveAchievement(emailToSocket, 'Revolución industrial', user.email);
          break;
        }
      }
    }

    //99 troops in a territory unlocks you an achievement
    if (state.map[territory].troops === 99 && state.map[territory].player == playerIndex) {
      await giveAchievement(emailToSocket, 'La Armada Invencible', user.email);
    }
  } else {
    socketEmit(socket, 'notInARoom', user.email);
  }
}

/**
 * @description Handles the victory of a user, sending to all
 * the users a game over event and the user that has won the game
 * @param {Set} emailToSocket
 * @param {user} user
 */
async function victoryHandler(emailToSocket, user) {
  if (sids.has(user.email)) {
    let userCode = sids.get(user.email).code;
    let rank = updateRanking(roomState.get(userCode));
    // Emit victory event to the winning player
    sendingThroughEmail(emailToSocket, user.email, 'victory', { email: user.email });
    // Emit game over to all the rest of users
    sendToAllWithCode(emailToSocket, userCode, 'gameOver', { email: user.email, ranking: rank });

    //All the users are out
    let players = getUsersWithCode(userCode);
    for (const player of players) {
      leaveRoom(emailToSocket, player);
    }
    rooms.delete(userCode);
    roomState.delete(userCode);
    console.log('Vamos a actualizar las victorias de  ' + user.email);
    // Update wins and achievements
    await giveWins(emailToSocket, user.email);
  }
}

/**
 * @description If the user is in the middle of a game
 * it sends the map for them.
 * @param {socket} socket
 * @param {user} user
 */
function getMap(socket, user) {
  //Check if the user is in the room
  if (sids.has(user.email)) {
    let userCode = sids.get(user.email).code;
    const state = roomState.get(userCode);
    if (state) {
      socketEmit(socket, 'mapSent', state);
    }
  }
}

/**
 * @description Sends a message to all the users in the game.
 * If the user is not in a game it sends an error event
 * @param {socket} socket
 * @param {Set} emailToSocket
 * @param {user} user
 * @param {string} message
 */
function chat(socket, emailToSocket, user, message) {
  //Check if the user is in the room
  if (sids.has(user.email)) {
    let userCode = sids.get(user.email).code;
    //Send the message to all the users including himself
    sendToAllWithCode(emailToSocket, userCode, 'messageReceived', { message, user: user.email });
  } else {
    socketEmit(socket, 'notInARoom', user.email);
  }
}

/**
 * @description Send an invitation to a friend
 * to join a lobby
 * @param {socket} socket
 * @param {Set} emailToSocket
 * @param {user} user
 * @param {string} friendEmail
 */
function invite(socket, emailToSocket, user, friendEmail) {
  if (sids.has(user.email)) {
    let userCode = sids.get(user.email).code;
    //Get the info of the user that is inviting
    const userInfo = { email: user.email, name: user.name, picture: user.picture };
    //Send the invitation
    sendingThroughEmail(emailToSocket, friendEmail, 'invitationReceived', { userCode, userInfo });
  } else {
    socketEmit(socket, 'notInARoom', user.email);
  }
}

/**
 * @description Check if the user was in a game
 * if it was on it reconnect it to that game
 * @param {socket} socket
 * @param {user} user
 */
async function reconectionHandler(socket, user) {
  if (sids.has(user.email)) {
    let userCode = sids.get(user.email).code;
    let players = getUsersWithCode(userCode);
    let usersInfo = await getUsersInfo(players);
    socketEmit(socket, 'connectedPlayers', usersInfo);
    getMap(socket, user);
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
  giveAchievement,
  reconectionHandler,
};

//---------------------------------Private functions---------------------------------
// Send a message to a specific user
function socketEmit(socket, event, data) {
  //Check the socket conecction
  if (socket.connected) {
    console.log(`Emitiendo evento ${event} con valores ${JSON.stringify(data)} a ${socket.id}`);
    socket.emit(event, data);
  } else {
    console.log(`La conexión del socket ${socket.id} está cerrada.`);
  }
}

//Given a code it sends a message containing event to all the players that used that code
function sendToAllWithCode(emailToSocket, code, event, data) {
  let usersWithCode = getUsersWithCode(Number(code));
  usersWithCode.forEach((email) => {
    sendingThroughEmail(emailToSocket, email, event, data);
  });
}
// Given an email it emits an event to the corresponding socket
function sendingThroughEmail(emailToSocket, email, event, data) {
  const socket = emailToSocket.get(email);
  if (socket) {
    if (socket.connected) {
      socket.emit(event, data);
    } else {
      console.log('The socket is not connected');
    }
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

// Function for search if the user have the achievement
async function giveAchievement(emailToSocket, achievementTitle, email) {
  try {
    const achievementUnlocked = await ObtainsController.hasAchievement(achievementTitle, email);
    if (!achievementUnlocked) {
      await ObtainsController.insert(achievementTitle, email);
      const achievement = await AchievementController.selectAchievement(achievementTitle);
      if (emailToSocket) {
        sendingThroughEmail(emailToSocket, email, 'achievementUnlocked', achievement);
      }
    }
  } catch (error) {
    throw error;
  }
}

// Functions for make the code more simple
async function giveWins(emailToSocket, userMail) {
  await PlayerController.updateWins(userMail);
  const numWins = await PlayerController.getWins(userMail);
  console.log('Vamos a darle una victoria a ' + userMail);
  if (Number(numWins) === 1) {
    await giveAchievement(emailToSocket, 'Comandante principiante', userMail);
  }
  if (Number(numWins) === 10) {
    await giveAchievement(emailToSocket, 'Comandante experimentado', userMail);
  } else if (Number(numWins) === 100) {
    await giveAchievement(emailToSocket, 'Comandante veterano', userMail);
  }
}
