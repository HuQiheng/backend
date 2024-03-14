// compoundController.test.js
const db = require('../../db');
const {
  insertCompound,
  deleteCompound,
  selectCompound,
  selectAllCompounds,
} = require('../../controllers/CompoundController');

jest.mock('../../db');

describe('Compound Controller', () => {
  afterEach(() => {
    // Clear mock implementation after each test
    db.query.mockReset();
  });

  test('Insert Compound', async () => {
    const playersEmail = 'test1@example.com';
    const gamesAccessKey = 'testKey';
    const mockResult = { rows: [] };
    db.query.mockResolvedValueOnce(mockResult);

    const result = await insertCompound(playersEmail, gamesAccessKey);

    expect(db.query).toHaveBeenCalledWith(expect.any(String), [playersEmail, gamesAccessKey]);
    expect(result).toEqual(mockResult);
  });

  test('Delete Compound', async () => {
    // Define the test data
    const playersEmail = 'test1@example.com';
    const gamesAccessKey = 'testKey';

    // Mock result for deletion
    const deleteMockResult = { rowCount: 1 }; // Assuming one record was deleted
    db.query.mockResolvedValueOnce(deleteMockResult);

    // Call the deleteCompound function
    const result = await deleteCompound(playersEmail, gamesAccessKey);

    // Verify that the db.query function was called with the correct arguments
    expect(db.query).toHaveBeenCalledWith(expect.any(String), [playersEmail, gamesAccessKey]);

    // Verify that the result returned by deleteCompound matches the expected result
    expect(result).toEqual(deleteMockResult);
  });

  test('Select Compound', async () => {
    // Define the data to be inserted
    const playersEmail = 'test1@example.com';
    const gamesAccessKey = 'testKey';

    // Mock result for insertion
    const insertResult = { rows: [] };
    db.query.mockResolvedValueOnce(insertResult);

    // Call the insertCompound function to insert the data
    await insertCompound(playersEmail, gamesAccessKey);

    // Mock result for selection
    const selectResult = { rows: [{ players_email: playersEmail, games_accessKey: gamesAccessKey }] };
    db.query.mockResolvedValueOnce(selectResult);

    // Call the selectCompound function to select the inserted data
    const result = await selectCompound(playersEmail, gamesAccessKey);

    // Verify that the insertCompound function was called with the correct arguments
    expect(db.query).toHaveBeenCalledWith(expect.any(String), [playersEmail, gamesAccessKey]);

    // Verify that the selectCompound function was called with the correct arguments
    expect(db.query).toHaveBeenCalledWith(expect.any(String), [playersEmail, gamesAccessKey]);

    // Verify that the result returned by selectCompound matches the expected result
    expect(result).toEqual(selectResult);
  });

  test('Select All Compounds', async () => {
    // Define mock data for compounds
    const mockCompounds = [
      { id: 1, playersEmail: 'test1@example.com', gamesAccessKey: 'key1' },
      { id: 2, playersEmail: 'test2@example.com', gamesAccessKey: 'key2' },
    ];

    // Mock result for selecting all compounds
    const mockResult = { rows: mockCompounds };
    db.query.mockResolvedValueOnce(mockResult);

    // Call the selectAllCompounds function
    const result = await selectAllCompounds();

    // Verify that db.query was called with the correct SQL query
    expect(db.query).toHaveBeenCalledWith(expect.any(String));

    // Verify that the result returned by selectAllCompounds matches the expected result
    expect(result).toEqual(mockResult);
  });
});
