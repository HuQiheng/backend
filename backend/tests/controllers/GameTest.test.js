// gameController.test.js
const db = require('../../db/index');
const {
    insertGame,
    updateGame,
    deleteGame,
    selectGame,
    selectAllGames
} = require('../../controllers/GameController');

jest.mock('../../db/index');

describe('Game Controller', () => {
    afterEach(() => {
        // Clear mock implementation after each test
        db.query.mockReset();
    });

    test('Insert Game', async () => {
        const accessKey = 'abc123';
        const ranking = 10;
        const date = new Date();
        const mockResult = { rows: [] };
        db.query.mockResolvedValueOnce(mockResult);

        const result = await insertGame(accessKey, ranking, date);

        expect(db.query).toHaveBeenCalledWith(expect.any(String), [accessKey, ranking, date]);
        expect(result).toEqual(mockResult);
    });

    test('Update Game', async () => {
      // Define the test data
      const accessKey = 'abc123';
      const ranking = 10;
      const date = new Date();
  
      // Mock result for updating the game
      const mockResult = { rowCount: 1 }; // Assuming one record was updated
      db.query.mockResolvedValueOnce(mockResult);
  
      // Call the updateGame function
      const result = await updateGame(accessKey, ranking, date);
  
      // Verify that db.query was called with the correct SQL query and parameters
      expect(db.query).toHaveBeenCalledWith(expect.any(String), [ranking, date, accessKey]);
  
      // Verify that the result returned by updateGame matches the expected result
      expect(result).toEqual(mockResult);
  });
  

    test('Delete Game', async () => {
        const accessKey = 'abc123';
        const mockResult = { rows: [] };
        db.query.mockResolvedValueOnce(mockResult);

        const result = await deleteGame(accessKey);

        expect(db.query).toHaveBeenCalledWith(expect.any(String), [accessKey]);
        expect(result).toEqual(mockResult);
    });

    test('Select Game', async () => {
      // Define the test data
      const accessKey = 'abc123';
      
      // Mock data for the selected game
      const selectedGame = {
          accessKey: 'abc123',
          ranking: 10,
          date: new Date(),
      };
  
      // Mock result for selecting the game
      const mockResult = { rows: [selectedGame] };
      db.query.mockResolvedValueOnce(mockResult);
  
      // Call the selectGame function
      const result = await selectGame(accessKey);
  
      // Verify that db.query was called with the correct SQL query and parameters
      expect(db.query).toHaveBeenCalledWith(expect.any(String), [accessKey]);
  
      // Verify that the result returned by selectGame matches the expected result
      expect(result).toEqual(mockResult);
  });
  

  test('Select All Games', async () => {
    // Define mock data for games
    const mockGames = [
        { accessKey: 'key1', ranking: 10, date: new Date() },
        { accessKey: 'key2', ranking: 20, date: new Date() }
    ];

    // Mock result for selecting all games
    const mockResult = { rows: mockGames };
    db.query.mockResolvedValueOnce(mockResult);

    // Call the selectAllGames function
    const result = await selectAllGames();

    // Verify that db.query was called with the correct SQL query
    expect(db.query).toHaveBeenCalledWith(expect.any(String));

    // Verify that the result returned by selectAllGames matches the expected result
    expect(result).toEqual(mockResult);
});

});
