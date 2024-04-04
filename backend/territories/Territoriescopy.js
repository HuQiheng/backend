// Process territories.json for take information about territories
const fs = require('fs');
const data = require('../territories.json');
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
function getTerritories(players, data, room) {
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

// Move troops
function moveTroops(state, from, to, troops) {
    const map = state.map;
    if ((map[from].troops - troops) >= 1) {
        if (map[from].player !== map[to].player) {
            if (troops > map[to].troops) {
                map[to].player = map[from].player;
                map[to].troops = troops - map[to].troops;
                map[from].troops -= troops;
            } else {
                map[to].troops -= troops;
                map[from].troops -= troops;
            }
        } else {
            map[to].troops += troops;
            map[from].troops -= troops;
        }
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
}

// Shift management
function nextTurn(state) {
    state.turn = (state.turn + 1) % state.players.length;
}

// Buy actives
function buyActives(state, player, type) {
    const map = state.map;
    if (type === 'troops') {
        if (player.coins >= 3) {
            player.coins -= 3;
            player.troops += 1;
        }
    } else if (type === 'factory') {
        if (player.coins >= 10) {
            player.coins -= 10;
            player.factories += 1;
        }
    }
}

module.exports = {
    assignTerritories,
    getTerritories, 
    moveTroops,
    nextTurn,
    surrender,
    buyActives,
};