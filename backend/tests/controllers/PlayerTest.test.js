// playerController.test.js
const db = require('../../db/index');
const {
  insertPlayer,
  updatePlayer,
  deletePlayer,
  selectPlayer,
  selectAllPlayers,
  verificarCredenciales,
} = require('../../controllers/PlayerController');

jest.mock('../../db/index');

describe('Player Controller', () => {
  afterEach(() => {
    // Clear mock implementation after each test
    db.query.mockReset();
  });

  test('Insert Player', async () => {
    const email = 'test@example.com';
    const username = 'testuser';
    const password = 'testpassword';
    const mockResult = { rows: [] };
    db.query.mockResolvedValueOnce(mockResult);

    const result = await insertPlayer(email, username, password);

    expect(db.query).toHaveBeenCalledWith(expect.any(String), [email, username, password]);
    expect(result).toEqual(mockResult);
  });

  test('Update Player', async () => {
    // Define the test data
    const email = 'test@example.com';
    const username = 'testuser';
    const password = 'testpassword';

    // Mock result for inserting the player (assuming one player was successfully inserted)
    const insertMockResult = { rowCount: 1 };
    db.query.mockResolvedValueOnce(insertMockResult);

    // Insert the mock player
    await insertPlayer(email, username, password);

    // Mock result for updating the player
    const updateMockResult = { rowCount: 1 }; // Assuming one player was successfully updated
    db.query.mockResolvedValueOnce(updateMockResult);

    // Call the updatePlayer function
    const result = await updatePlayer(email, username, password);

    // Verify that db.query was called with the correct SQL query and parameters
    expect(db.query).toHaveBeenCalledWith(expect.any(String), [email, username, password]);

    // Verify that the result returned by updatePlayer matches the expected result
    expect(result).toEqual(updateMockResult);
  });

  test('Delete Player', async () => {
    // Define the test data
    const email = 'test@example.com';

    // Mock result for inserting the player (assuming one player was successfully inserted)
    const insertMockResult = { rowCount: 1 };
    db.query.mockResolvedValueOnce(insertMockResult);

    // Insert the mock player
    await insertPlayer(email, 'username', 'password');

    // Mock result for deleting the player
    const deleteMockResult = { rowCount: 1 }; // Assuming one player was successfully deleted
    db.query.mockResolvedValueOnce(deleteMockResult);

    // Call the deletePlayer function
    const result = await deletePlayer(email);

    // Verify that db.query was called with the correct SQL query and parameters
    expect(db.query).toHaveBeenCalledWith(expect.any(String), [email]);

    // Verify that the result returned by deletePlayer matches the expected result
    expect(result).toEqual(deleteMockResult);
  });

  test('Select Player', async () => {
    // Define the test data
    const email = 'test@example.com';
    const username = 'testuser';
    const password = 'testpassword';

    // Mock result for inserting the player (assuming one player was successfully inserted)
    const insertMockResult = { rowCount: 1 };
    db.query.mockResolvedValueOnce(insertMockResult);

    // Insert the mock player
    await insertPlayer(email, username, password);

    // Mock result for selecting the player
    const selectedPlayer = { email, username, password };
    const selectMockResult = { rows: [selectedPlayer] };
    db.query.mockResolvedValueOnce(selectMockResult);

    // Call the selectPlayer function
    const result = await selectPlayer(email);

    // Verify that db.query was called with the correct SQL query and parameters
    expect(db.query).toHaveBeenCalledWith(expect.any(String), [email]);

    // Verify that the result returned by selectPlayer matches the expected result
    expect(result).toEqual(selectMockResult);
  });

  test('Select All Players', async () => {
    // Define mock data for players
    const mockPlayers = [
      { email: 'test1@example.com', username: 'testuser1', password: 'password1' },
      { email: 'test2@example.com', username: 'testuser2', password: 'password2' },
    ];

    // Mock result for selecting all players
    const mockResult = { rows: mockPlayers };
    db.query.mockResolvedValueOnce(mockResult);

    // Call the selectAllPlayers function
    const result = await selectAllPlayers();

    // Verify that db.query was called with the correct SQL query
    expect(db.query).toHaveBeenCalledWith(expect.any(String));

    // Verify that the result returned by selectAllPlayers matches the expected result
    expect(result).toEqual(mockResult);
  });

  test('Verificar Credenciales', async () => {
    // Define the test data
    const email = 'test@example.com';
    const password = 'testpassword';

    // Mock result for inserting the player
    const insertMockResult = { rowCount: 1 };
    db.query.mockResolvedValueOnce(insertMockResult);

    // Insert the mock player
    await insertPlayer(email, 'testuser', password);

    // Mock result for verifying credentials
    const mockResult = { rowCount: 1 }; // Assuming credentials match (one row found)
    db.query.mockResolvedValueOnce(mockResult);

    // Call the verificarCredenciales function
    const result = await verificarCredenciales(email, password);

    // Verify that db.query was called with the correct SQL query and parameters
    expect(db.query).toHaveBeenCalledWith(expect.any(String), [email, password]);

    // Verify that the result returned by verificarCredenciales matches the expected result
    expect(result).toBe(true);
  });
});
