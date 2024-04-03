// territoriesTest.test.js
const { assignTerritories, getTerritories } = require('./Territories'); 
const { joinRoom, createRoom, leaveRoom } = require('./middleware/game.js');

describe('Territory Assignment', () => {
    const mockPlayers = ['Player1', 'Player2', 'Player3'];
    const mockRoom = 'sala';
    beforeEach(() => {
        createRoom('Player1', mockRoom);
        joinRoom('Player1', mockRoom, 3);
        joinRoom('Player2', mockRoom, 3);
        joinRoom('Player3', mockRoom, 3);
    }),
    afterAll(() => {
        leaveRoom('Player1', mockRoom);
        leaveRoom('Player2', mockRoom);
        leaveRoom('Player3', mockRoom);
    });
    const mockTerritories = {
        territory1: { name: 'Territorio 1' },
        territory2: { name: 'Territorio 2' },
        territory3: { name: 'Territorio 3' },
    };

    it('debería asignar territorios a los jugadores', () => {
        const result = assignTerritories(mockPlayers, mockTerritories);
        expect(Object.keys(result)).toHaveLength(Object.keys(mockTerritories).length);
        expect(result.territory1).toBeLessThan(mockPlayers.length);
    });

    it('debería crear un mapa válido de territorios', () => {
        const result = getTerritories(mockPlayers, mockTerritories, mockRoom);
        expect(result).toHaveProperty('turn', 0);
        expect(result.players).toEqual(mockPlayers);
    });
});



