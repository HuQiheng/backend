// Process territories.json for take information about territories
const fs = require('fs');
const data = require('./territories.json');
const { rooms } = require('./middleware/game.js');

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
            player: territoryAssignment[i], // Without player asigned yet
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
    // Guardar el estado del juego en un archivo
    fs.writeFileSync('gameState.json', JSON.stringify(state, null, 4));
    return state;
}

module.exports = {
    assignTerritories,
    getTerritories, 
};