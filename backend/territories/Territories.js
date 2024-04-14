// Process territories.json for take information about territories
const fs = require('fs');
const data = require('./territories.json');

// Assign territories
function assignTerritories(players, data) {
  const initialFactories = 0;
  const initialTroops = 3;
  const initialCoins = 0;
  const state = {
    turn: 0,
    phase: 0,
    players: players.map((player, index) => ({
      name: player.username,
      email: player.email,
      picture: player.picture,
      coins: initialCoins,
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

  return state;
}

function getPlayers(room) {
  const p = rooms.get(room);
  return Array.from(p);
}

// Map territories
function getTerritories(data, room) {
  const map = {};
  players = getPlayers(room);
  const territoryAssignment = assignTerritories(players, data);
  for (const i in data) {
    const territory = data[i];
    map[i] = {
      name: territory.name,
      player: territoryAssignment[i],
      troops: 3, // Initial troops
      factories: 0,
    };
  }
  // Game state
  const state = {
    turn: 0,
    players: players,
    map: map,
  };
  // Store the game state in an external file
  fs.writeFileSync('gameState.json', JSON.stringify(state, null, 4));
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
function attackTerritories(state, from, to, troops, player) {
  let playerIndex = state.players.findIndex((p) => p.email.trim() === player.trim());
  const map = state.map;
  if (state.turn === playerIndex) {
    if (map[from].troops - troops >= 1) {
      if (map[from].player === playerIndex && map[to].player !== playerIndex) {
        if (troops > map[to].troops) {
          map[to].troops = troops - map[to].troops;
          map[to].player = playerIndex;
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
  return state;
}

// Surrender
function surrender(state, player) {
  let playerIndex = state.players.findIndex((p) => p.email.trim() === player.trim());
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
  console.log('Player surrendered');
  return state;
}

// Shift management
function nextTurn(state) {
  //Check if the phase is the last one
  if (state.phase === 2) {
    //Cacluate the number of coins for every player
    for (let playerNumber = 0; playerNumber < state.players.length; playerNumber++) {
      let coins = countPlayerCoins(state, playerNumber);
      state.players[playerNumber].coins += coins;
    }

    // Next turn
    state.turn = (state.turn + 1) % state.players.length;
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
  let playerIndex = state.players.findIndex((p) => p.email.trim() === player.trim());
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
  if (state.player[playerIndex].coins >= cost && map[territory].player === playerIndex) {
    if (type === 'factory' && map[territory].factories === 0) {
      state.player[playerIndex].coins -= cost;
      map[territory].factories += numActives;
    } else if (type === 'factory' && map[territory].factories > 0) {
      console.log('Territory already has a factory');
    } else if (type === 'troop') {
      state.player[playerIndex].coins -= cost;
      map[territory].troops += numActives;
    }
  } else {
    console.log('Not enough coins or territory is not owned by the player');
  }
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
module.exports = {
  assignTerritories,
  getTerritories,
  moveTroops,
  nextTurn,
  surrender,
  buyActives,
  attackTerritories,
  nextPhase,
};
