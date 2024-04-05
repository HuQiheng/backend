// Process territories.json for take information about territories
const fs = require('fs');
const data = require('./territories.json');
const { rooms } = require('../middleware/game.js');

// Assign territories
function assignTerritories(players, data) {
    const territoryAssignment = {};
    const shuffledTerritories = Object.keys(data).sort(() => Math.random() - 0.5); // Random
    const numPlayers = players.length;
    shuffledTerritories.forEach((i, j) => {
        const playerIndex = j % numPlayers; // module numPlayers
        territoryAssignment[i] = playerIndex; 
    });
    return territoryAssignment;
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
            factories: 0
        };
    }
    // Game state
    const state = {
        turn: 0,
        players: players,
        map: map
    };
    // Store the game state in an external file
    fs.writeFileSync('gameState.json', JSON.stringify(state, null, 4));
    return state;
}

// A Player Move troops
function moveTroops(state, from, to, troops, player) {
    const map = state.map;
    if (state.turn === player) {
        if ((map[from].troops - troops) >= 1) {
            if (map[from].player === player && map[to].player === player) {
                map[to].troops += troops;
                map[from].troops -= troops;
            } else {
                console.log("Territories are owned by different players");
            }
        } else {
            console.log("No troops available");
        }
    } else {
        console.log("Not your turn");
    }
}

// Player Attack territories
function attackTerritories(state, from, to, troops, player) {
    const map = state.map;
    if (state.turn === player) {
        if ((map[from].troops - troops) >= 1) {
            if (map[from].player === player && map[to].player !== player) {
                if (troops > map[to].troops) {
                    map[to].troops = troops - map[to].troops;
                    map[to].player = player;
                } else {
                    map[to].troops -= troops;
                }
                map[from].troops -= troops;
            } else {
                console.log("Territories are owned by the same player");
            }
        } else {
            console.log("No troops available");
        }
    } else {
        console.log("Not your turn");
    }
}

// Surrender
function surrender(state, player) {
    const map = state.map;
    for (const i in map) {
        if (map[i].player === player) {
            state.players = state.players.filter(p => p !== player);
            // asign territory to another player
            let j = Math.floor(Math.random() * state.players.length);
            while (j === player) {
                j = Math.floor(Math.random() * state.players.length);
            }
            map[i].player = j;
        }
    }
    nextTurn(state);
}

// Shift management
function nextTurn(state) {
    const currentPlayer = state.players[state.turn];
    // Asign coins to the current player
    for (const j in state.map) {
        if (state.map[j].player === state.turn) {
            currentPlayer.coins += 1;
            if (state.map[j].factories > 0) {
                currentPlayer.coins += 4;
            }
        }
    }
    // Shift
    state.turn = (state.turn + 1) % state.players.length;
}

// Buy actives
function buyActives(state, player, type, territory, numActives) {
    const map = state.map;
    if (type === 'factory') {
        var cost = 15;
    }
    else if (type === 'troop' && numActives == 5) {
        var cost = 5;
    }
    else if (type === 'troop' && numActives == 10) {
        var cost = 10;
    }
    else if (type === 'troop') {
        var cost = 2 * numActives;
    }
    if (player.coins >= cost && map[territory].player === player) {
        if (type === 'factory' && map[territory].factories === 0) {
            player.coins -= cost;
            map[territory].factories += numActives;
        } else if (type === 'factory' && map[territory].factories > 0) {
            console.log("Territory already has a factory");
        } else if (type === 'troop') {
            player.coins -= cost;
            map[territory].troops += numActives;
        }
    } else {
        console.log("Not enough coins or territory is not owned by the player");
    }
}

module.exports = {
    assignTerritories,
    getTerritories, 
    moveTroops,
    nextTurn,
    surrender,
    buyActives,
    attackTerritories,
};