// Process territories.json for take information about territories
const fs = require('fs');
const data = require('./territories.json');

const players = [{
    name: 'Jaime',
    email: 'jaime@gmail.com',
    picture: 'sdffd'
},
{
    name: 'Javier',
    email: 'javier@gmail.com',
    picture: 'sfsff'
},
{
    name: 'Jorge',
    email: 'jorge@gmail.com',
    picture: 'sfdsfd'
},
{
    name: 'Job',
    email: 'job@gmail.com',
    picture: 'sfddsff'
}
];

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

// Map territories
function getTerritories(players, data) {
    const map = {};
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

    return state;
}

// Guardar el estado del juego en un archivo
fs.writeFileSync('gameState.json', JSON.stringify(getTerritories(players, data), null, 4));