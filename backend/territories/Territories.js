
// Assign territories
function assignTerritories(players, data) {
  const initialFactories = 0;
  const initialTroops = 3;
  const initialCoins = 0;
  const initialPoints = 0;
  const state = {
    turn: 0,
    phase: 0,
    players: players.map((player, index) => ({
      name: player.username,
      email: player.email,
      picture: player.picture,
      coins: initialCoins,
      points: initialPoints,
    })),
    map: {},
  };

  const shuffledTerritories = Object.keys(data).sort(() => Math.random() - 0.5); // Random
  const numPlayers = players.length;

  shuffledTerritories.forEach((i, j) => {
    const playerIndex = j % numPlayers; // module numPlayers
    state.map[i] = {
      name: data[i].name,
      player: playerIndex,
      troops: initialTroops,
      factories: initialFactories,
    };
  });

  for (let playerNumber = 0; playerNumber < state.players.length; playerNumber++) {
    let coins = countPlayerCoins(state, playerNumber);
    state.players[playerNumber].coins += coins;
  }

  return state;
}


// A Player Move troops
function moveTroops(state, from, to, t, player) {
  let playerIndex = state.players.findIndex((p) => p.email.trim() === player.trim());
  let map = state.map;
  troops = parseInt(t, 10);
  if (state.turn === playerIndex) {
    if (map[from].troops - troops >= 1) {
      if (map[from].player === playerIndex && map[to].player === playerIndex) {
        map[to].troops += troops;
        map[from].troops -= troops;
      } else {
        console.log('Territories are owned by different players');
      }
    } else {
      console.log('No troops available');
    }
  } else {
    console.log('Not your turn');
  }
  return state;
}

// Player Attack territories
function attackTerritories(state, from, to, troops, player, emailToSocket) {
  //Points that a user gain for a succesful attack
  const conquerPoints = 1;
  let playerIndex = state.players.findIndex((p) => p.email.trim() === player.trim());
  console.log("Estado del ataque");
  console.log("Numero de tropas usadas");
  console.log(troops);
  const map = state.map;
  conquered = false;
  let winner = false;
  if (state.turn === playerIndex) {
    if (map[from].troops - troops >= 1) {
      if (map[from].player === playerIndex && map[to].player !== playerIndex) {
        if (troops > map[to].troops) {
          map[to].troops = troops - map[to].troops;
          map[to].player = playerIndex;
          state.players[playerIndex].points += conquerPoints;
          conquered = true;
          // Check if the player conquered all territories and win the game
          if(checkVictory(state, player)) {
            winner = true;
          }
        } else {
          map[to].troops -= troops;
        }
        map[from].troops -= troops;
      } else {
        console.log('Territories are owned by the same player');
      }
    } else {
      console.log('No troops available');
    }
  } else {
    console.log('Not your turn');
  }
  return {state, conquered, winner, player};
}

// Check if the player named player conquered all territories
function checkVictory(state, player) {
  let playerIndex = state.players.findIndex((p) => p.email.trim() === player.trim());
  let samePlayer = true;
  for (let i = 0; i < state.map.length; i++) {
    if (state.map[i].player !== playerIndex) {
      samePlayer = false;
      break;
    }
  }
  if (samePlayer) {
    return true;
  } else {
    return false;
  }
}

//Check if any of the players has conquered al the territories
function checkWinner(gameState) {
  let players = new Set();
  for (let territory in gameState.map) {
    players.add(gameState.map[territory].player);
  }
  if (players.size === 1) {
    return Array.from(players)[0]; // Return the player number if there is a winner
  } else {
    return -1; // Return -1 if there is no winner
  }
}

// Surrender
function surrender(state, player) {
  let playerIndex = state.players.findIndex((p) => p.email.trim() === player.trim());
  let winner = false;
  console.log('index of the player that surrendered');
  console.log(playerIndex);
  const map = state.map;
  for (const i in map) {
    if (map[i].player === playerIndex) {
      // asign territory to another player
      let j = Math.floor(Math.random() * state.players.length);
      while (j === playerIndex) {
        j = Math.floor(Math.random() * state.players.length);
      }
      map[i].player = j;
    }
  }
  state.map = map;
  const indexWinner = checkWinner(state);
  //There is a winner
  let playerWinner;
  if(indexWinner !== -1){
    winner = true;
    playerWinner = state.players[indexWinner];
  }
  console.log('Player surrendered');
  return {state, winner, playerWinner};
}

// Shift management
function nextTurn(state) {
  //Check if the phase is the last one
  if (state.phase === 2) {
    //Cacluate the number of coins for every player
    // Next turn
    state.turn = (state.turn + 1) % state.players.length;
    let coins = countPlayerCoins(state, state.turn);
    state.players[state.turn].coins += coins;
    state.phase = 0;
  }
  return state;
}

// Given the data of a game it changes the phase we're a player is
function nextPhase(state) {
  if (state.phase === 0 || state.phase === 1) {
    state.phase += 1;
  }
  return state;
}

// Buy actives
function buyActives(state, player, type, territory, numActives) {
  //Obtain the index in the state object
  let playerIndex = state.players.findIndex((p) => p.email.trim() === player.trim());
  console.log('Indice del jugador');
  console.log(playerIndex);
  const map = state.map;
  console.log(state.players[playerIndex].coins);
  if (type === 'factory') {
    var cost = 15;
  } else if (type === 'troop' && numActives == 5) {
    var cost = 5;
  } else if (type === 'troop' && numActives == 10) {
    var cost = 10;
  } else if (type === 'troop') {
    var cost = 2 * numActives;
  }
  if (state.players[playerIndex].coins >= cost  && map[territory].player === playerIndex) {
    if (type === 'factory' && map[territory].factories === 0) {
      state.players[playerIndex].coins -= cost;
      map[territory].factories += numActives;
    } else if (type === 'factory' && map[territory].factories > 0) {
      console.log('Territory already has a factory');
    } else if (type === 'troop') {
      state.players[playerIndex].coins -= cost;
      map[territory].troops += numActives;
    } else {
      console.log("El tipo de tropa no es admisible");
    }
  } else {
    console.log('Not enough coins or territory is not owned by the player');
  }
  state.map = map;
  return state;
}

//Given a number of player it calculates the number of coins that this player have
function countPlayerCoins(state, playerNumber) {
  let count = 0;
  for (let territory in state.map) {
    if (state.map[territory].player === playerNumber) {
      count++;
      if (state.map[territory].factories === 1) {
        count = count + 4;
      }
    }
  }
  return count;
}

// Function that makes the ranking
function updateRanking(gameState) {
  // Copy the players array from the gameState
  const ranking = [...gameState.players];
  
  // Sort players array based on points in descending order
  ranking.sort((a, b) => b.points - a.points);
    
  
  /*const eliminatedPlayers = new Set();
  for (let player of gameState.players) {
    if (checkVictory(gameState, player.email)) {
      ranking.unshift(player);
    }
  }
  for (let player of gameState.players) {
    if (!eliminatedPlayers.has(player.email)) {
      if (player.email !== ranking[0]?.email) {
        ranking.push(player);
      }
    }
  }
  for (let player of gameState.players) {
    if (!ranking.some((p) => p.email === player.email)) {
      ranking.push(player);
    }
  }*/
  return ranking;
}

module.exports = {
  assignTerritories,
  moveTroops,
  nextTurn,
  surrender,
  buyActives,
  attackTerritories,
  nextPhase,
  updateRanking,
};