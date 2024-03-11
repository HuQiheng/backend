// PlayerController.test.js
const PlayerController = require('../../controllers/PlayerController.js');

// Mocking the database query function
jest.mock('../../db/index.js', () => ({
  db: {
    query: jest.fn(),
  },
}));

describe('PlayerController', () => {
  beforeEach(() => {
    // Clear mock calls before each test
    jest.clearAllMocks();
  });

  it('should insert a player', async () => {
    const email = 'john@example.com';
    const username = 'john_doe';
    const password = 'password123';

    // Mock the database query result
    const mockResult = { rows: [{ id: 1, email, username, password }] };
    require('../../db/index.js').db.query.mockResolvedValueOnce(mockResult);

    const controller = new PlayerController();
    const result = await controller.insert(email, username, password);

    expect(result).toEqual(mockResult);
    expect(require('../../db/index.js').db.query).toHaveBeenCalledWith(
      'INSERT INTO Player (email, username, password) VALUES ($1, $2, $3)',
      [email, username, password]
    );
  });

  it('should update a player', async () => {
    const email = 'john@example.com';
    const username = 'john_doe_updated';
    const password = 'new_password';

    // Mock the database query result
    const mockResult = { rowCount: 1 };
    require('../../db/index.js').db.query.mockResolvedValueOnce(mockResult);

    const controller = new PlayerController();
    const result = await controller.update(email, username, password);

    expect(result).toEqual(mockResult);
    expect(require('../../db/index.js').db.query).toHaveBeenCalledWith(
      'UPDATE Player SET username = $2, password = $3 WHERE email = $1',
      [email, username, password]
    );
  });

  it('should delete a player', async () => {
    const email = 'john@example.com';

    // Mock the database query result
    const mockResult = { rowCount: 1 };
    require('../../db/index.js').db.query.mockResolvedValueOnce(mockResult);

    const controller = new PlayerController();
    const result = await controller.delete(email);

    expect(result).toEqual(mockResult);
    expect(require('../../db/index.js').db.query).toHaveBeenCalledWith(
      'DELETE FROM Player WHERE email = $1',
      [email]
    );
  });

  it('should select a player by email', async () => {
    const email = 'john@example.com';

    // Mock the database query result
    const mockResult = { rows: [{ id: 1, email, username: 'john_doe', password: 'password123' }] };
    require('../../db/index.js').db.query.mockResolvedValueOnce(mockResult);

    const controller = new PlayerController();
    const result = await controller.select(email);

    expect(result).toEqual(mockResult);
    expect(require('../../db/index.js').db.query).toHaveBeenCalledWith(
      'SELECT * FROM Player WHERE email = $1',
      [email]
    );
  });

  it('should select all players', async () => {
    // Mock the database query result
    const mockResult = { rows: [{ id: 1, email: 'john@example.com', username: 'john_doe', password: 'password123' }] };
    require('../../db/index.js').db.query.mockResolvedValueOnce(mockResult);

    const controller = new PlayerController();
    const result = await controller.selectAll();

    expect(result).toEqual(mockResult);
    expect(require('../../db/index.js').db.query).toHaveBeenCalledWith('SELECT * FROM Player');
  });

  it('should verify player credentials successfully', async () => {
    const email = 'john@example.com';
    const password = 'password123';

    // Mock the database query result
    const mockResult = { rowCount: 1 };
    require('../../db/index.js').db.query.mockResolvedValueOnce(mockResult);

    const controller = new PlayerController();
    const result = await controller.verificarCredenciales(email, password);

    expect(result).toEqual(true);
    expect(require('../../db/index.js').db.query).toHaveBeenCalledWith(
      'SELECT * FROM Player WHERE email = $1 AND password = $2',
      [email, password]
    );
  });

  it('should fail to verify player credentials', async () => {
    const email = 'john@example.com';
    const password = 'wrong_password';

    // Mock the database query result for unsuccessful verification
    const mockResult = { rowCount: 0 };
    require('../../db/index.js').db.query.mockResolvedValueOnce(mockResult);

    const controller = new PlayerController();
    const result = await controller.verificarCredenciales(email, password);

    expect(result).toEqual(false);
    expect(require('../../db/index.js').db.query).toHaveBeenCalledWith(
      'SELECT * FROM Player WHERE email = $1 AND password = $2',
      [email, password]
    );
  });
});
