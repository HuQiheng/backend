// CompoundController.test.js
const CompoundController = require('../../controllers/CompoundController');

// Mocking the database query function
jest.mock('../../db/index.js', () => ({
  db: {
    query: jest.fn(),
  },
}));

describe('CompoundController', () => {
  beforeEach(() => {
    // Clear mock calls before each test
    jest.clearAllMocks();
  });

  it('should insert a compound', async () => {
    const playersEmail = 'test@example.com';
    const gamesAccessKey = 'ABCDEFG';

    // Mock the database query result
    const mockResult = { rows: [{ id: 1, Players_email: playersEmail, Games_accessKey: gamesAccessKey }] };
    require('../../db/index.js').db.query.mockResolvedValueOnce(mockResult);

    const controller = new CompoundController();
    const result = await controller.insert(playersEmail, gamesAccessKey);

    expect(result).toEqual(mockResult);
    expect(require('../../db/index.js').db.query).toHaveBeenCalledWith(
      'INSERT INTO Compound (Players_email, Games_accessKey) VALUES ($1, $2)',
      [playersEmail, gamesAccessKey]
    );
  });

  it('should delete a compound', async () => {
    const playersEmail = 'test@example.com';
    const gamesAccessKey = 'ABCDEFG';

    // Mock the database query result
    const mockResult = { rowCount: 1 };
    require('../../db/index.js').db.query.mockResolvedValueOnce(mockResult);

    const controller = new CompoundController();
    const result = await controller.delete(playersEmail, gamesAccessKey);

    expect(result).toEqual(mockResult);
    expect(require('../../db/index.js').db.query).toHaveBeenCalledWith(
      'DELETE FROM Compound WHERE Players_email = $1 AND Games_accessKey = $2',
      [playersEmail, gamesAccessKey]
    );
  });

  it('should select a compound', async () => {
    const playersEmail = 'test@example.com';
    const gamesAccessKey = 'ABCDEFG';

    // Mock the database query result
    const mockResult = { rows: [{ id: 1, Players_email: playersEmail, Games_accessKey: gamesAccessKey }] };
    require('../../db/index.js').db.query.mockResolvedValueOnce(mockResult);

    const controller = new CompoundController();
    const result = await controller.select(playersEmail, gamesAccessKey);

    expect(result).toEqual(mockResult);
    expect(require('../../db/index.js').db.query).toHaveBeenCalledWith(
      'SELECT * FROM Compound WHERE Players_email = $1 AND Games_accessKey = $2',
      [playersEmail, gamesAccessKey]
    );
  });

  it('should select all compounds', async () => {
    // Mock the database query result
    const mockResult = { rows: [{ id: 1, Players_email: 'test1@example.com', Games_accessKey: 'ABC123' }] };
    require('../../db/index.js').db.query.mockResolvedValueOnce(mockResult);

    const controller = new CompoundController();
    const result = await controller.selectAll();

    expect(result).toEqual(mockResult);
    expect(require('../../db/index.js').db.query).toHaveBeenCalledWith('SELECT * FROM Compound');
  });

  it('should throw an error when any database operation fails', async () => {
    const errorMessage = 'Database error';

    // Mock the database query to throw an error
    require('../../db/index.js').db.query.mockRejectedValueOnce(new Error(errorMessage));

    const controller = new CompoundController();
    await expect(controller.insert('test@example.com', 'ABCDEFG')).rejects.toThrow(errorMessage);
  });
});
