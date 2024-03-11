// GameController.test.js
const GameController = require('../../controllers/GameController.js');

// Mocking the database query function
jest.mock('../../db/index.js', () => ({
  db: {
    query: jest.fn(),
  },
}));

describe('GameController', () => {
  beforeEach(() => {
    // Clear mock calls before each test
    jest.clearAllMocks();
  });

  it('should insert a game', async () => {
    const accessKey = 'ABCDEFG';
    const ranking = 1;
    const date = new Date();

    // Mock the database query result
    const mockResult = { rows: [{ id: 1, accessKey, ranking, date }] };
    require('../../db/index.js').db.query.mockResolvedValueOnce(mockResult);

    const controller = new GameController();
    const result = await controller.insert(accessKey, ranking, date);

    expect(result).toEqual(mockResult);
    expect(require('../../db/index.js').db.query).toHaveBeenCalledWith(
      'INSERT INTO Game (accessKey, ranking, date) VALUES ($1, $2, $3)',
      [accessKey, ranking, date]
    );
  });

  it('should update a game', async () => {
    const accessKey = 'ABCDEFG';
    const ranking = 2;
    const date = new Date();

    // Mock the database query result
    const mockResult = { rowCount: 1 };
    require('../../db/index.js').db.query.mockResolvedValueOnce(mockResult);

    const controller = new GameController();
    const result = await controller.update(accessKey, ranking, date);

    expect(result).toEqual(mockResult);
    expect(require('../../db/index.js').db.query).toHaveBeenCalledWith(
      'UPDATE Game SET ranking = $1, date = $2 WHERE accessKey = $3',
      [ranking, date, accessKey]
    );
  });

  it('should delete a game', async () => {
    const accessKey = 'ABCDEFG';

    // Mock the database query result
    const mockResult = { rowCount: 1 };
    require('../../db/index.js').db.query.mockResolvedValueOnce(mockResult);

    const controller = new GameController();
    const result = await controller.delete(accessKey);

    expect(result).toEqual(mockResult);
    expect(require('../../db/index.js').db.query).toHaveBeenCalledWith(
      'DELETE FROM Game WHERE accessKey = $1',
      [accessKey]
    );
  });

  it('should select a game', async () => {
    const accessKey = 'ABCDEFG';

    // Mock the database query result
    const mockResult = { rows: [{ id: 1, accessKey, ranking: 1, date: new Date() }] };
    require('../../db/index.js').db.query.mockResolvedValueOnce(mockResult);

    const controller = new GameController();
    const result = await controller.select(accessKey);

    expect(result).toEqual(mockResult);
    expect(require('../../db/index.js').db.query).toHaveBeenCalledWith(
      'SELECT * FROM Game WHERE accessKey = $1',
      [accessKey]
    );
  });

  it('should select all games', async () => {
    // Mock the database query result
    const mockResult = { rows: [{ id: 1, accessKey: 'ABC123', ranking: 3, date: new Date() }] };
    require('../../db/index.js').db.query.mockResolvedValueOnce(mockResult);

    const controller = new GameController();
    const result = await controller.selectAll();

    expect(result).toEqual(mockResult);
    expect(require('../../db/index.js').db.query).toHaveBeenCalledWith('SELECT * FROM Game');
  });

  it('should throw an error when any database operation fails', async () => {
    const errorMessage = 'Database error';

    // Mock the database query to throw an error
    require('../../db/index.js').db.query.mockRejectedValueOnce(new Error(errorMessage));

    const controller = new GameController();
    await expect(controller.insert('ABCDEFG', 1, new Date())).rejects.toThrow(errorMessage);
  });
});
