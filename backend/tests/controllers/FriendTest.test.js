// FriendController.test.js
const FriendController = require('../../controllers/FriendController.js');

// Mocking the database query function
jest.mock('../../db/index.js', () => ({
  db: {
    query: jest.fn(),
  },
}));

describe('FriendController', () => {
  beforeEach(() => {
    // Clear mock calls before each test
    jest.clearAllMocks();
  });

  it('should insert a friend', async () => {
    const name = 'John Doe';
    const email = 'john@example.com';

    // Mock the database query result
    const mockResult = { rows: [{ id: 1, name, email }] };
    require('../../db/index.js').db.query.mockResolvedValueOnce(mockResult);

    const controller = new FriendController();
    const result = await controller.insert(name, email);

    expect(result).toEqual(mockResult);
    expect(require('../../db/index.js').db.query).toHaveBeenCalledWith(
      'INSERT INTO friend (Player_email1, Player_email2) VALUES(?, ?)',
      [name, email]
    );
  });

  it('should select all friends', async () => {
    // Mock the database query result
    const mockResult = { rows: [{ id: 1, name: 'Friend 1', email: 'friend1@example.com' }] };
    require('../../db/index.js').db.query.mockResolvedValueOnce(mockResult);

    const controller = new FriendController();
    const result = await controller.selectAll();

    expect(result).toEqual(mockResult);
    expect(require('../../db/index.js').db.query).toHaveBeenCalledWith('SELECT * FROM friend');
  });

  it('should remove a friend', async () => {
    const friendId = 1;

    // Mock the database query result
    const mockResult = { rowCount: 1 };
    require('../../db/index.js').db.query.mockResolvedValueOnce(mockResult);

    const controller = new FriendController();
    const result = await controller.remove(friendId);

    expect(result).toEqual(mockResult);
    expect(require('../../db/index.js').db.query).toHaveBeenCalledWith(
      'DELETE FROM friend WHERE Player_email2 = ?',
      [friendId]
    );
  });

  it('should throw an error when any database operation fails', async () => {
    const errorMessage = 'Database error';

    // Mock the database query to throw an error
    require('../../db/index.js').db.query.mockRejectedValueOnce(new Error(errorMessage));

    const controller = new FriendController();
    await expect(controller.insert('John Doe', 'john@example.com')).rejects.toThrow(errorMessage);
  });
});
