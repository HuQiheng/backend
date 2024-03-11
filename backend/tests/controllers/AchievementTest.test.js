// AchievementController.test.js
const AchievementController = require('../../controllers/AchievementController');

// Mocking the database query function
jest.mock('../../db/index.js', () => ({
db: {
query: jest.fn(),
},
}));

describe('AchievementController', () => {
beforeEach(() => {
// Clear mock calls before each test
jest.clearAllMocks();
});

it('should insert an achievement', async () => {
const title = 'Test Achievement';
const description = 'Test Description';

// Mock the database query result
const mockResult = { rows: [{ id: 1, title, description }] };
require('../../db/index.js').db.query.mockResolvedValueOnce(mockResult);

const controller = new AchievementController();
const result = await controller.insert(title, description);

expect(result).toEqual(mockResult);
expect(require('../../db/index.js').db.query).toHaveBeenCalledWith(
    'INSERT INTO Achievement (title, description) VALUES($1, $2)',
    [title, description]
);
});

it('should select all achievements', async () => {
// Mock the database query result
const mockResult = { rows: [{ id: 1, title: 'Achievement 1', description: 'Description 1' }] };
require('../../db/index.js').db.query.mockResolvedValueOnce(mockResult);

const controller = new AchievementController();
const result = await controller.selectAll();

expect(result).toEqual(mockResult);
expect(require('../../db/index.js').db.query).toHaveBeenCalledWith('SELECT * FROM Achievement');
});

it('should update an achievement', async () => {
    const title = 'Test Achievement';
    const description = 'Updated Description';
    
    // Mock the database query result
    const mockResult = { rowCount: 1, rows: [{ id: 1, title, description }] };
    require('../../db/index.js').db.query.mockResolvedValueOnce(mockResult);
    
    const controller = new AchievementController();
    const result = await controller.update(title, description);
    
    expect(result).toEqual(mockResult.rows[0]);
    expect(require('../../db/index.js').db.query).toHaveBeenCalledWith(
        'UPDATE Achievement SET description = $1 WHERE title = $2',
        [description, title]
);
});

it('should remove an achievement', async () => {
const title = 'Test Achievement';

// Mock the database query result
const mockResult = { rowCount: 1 };
require('../../db/index.js').db.query.mockResolvedValueOnce(mockResult);

const controller = new AchievementController();
const result = await controller.remove(title);

expect(result).toEqual(mockResult);
expect(require('../../db/index.js').db.query).toHaveBeenCalledWith('DELETE FROM Achievement WHERE title = $1', [title]);
});



it('should throw an error when updating a non-existing achievement', async () => {
    const title = 'Non-Existing Achievement';
    const description = 'Updated Description';
  
    // Mock the database query result
    const mockResult = { rowCount: 0 };
    require('../../db/index.js').db.query.mockResolvedValueOnce(mockResult);
  
    const controller = new AchievementController();
    
    // Use an asynchronous function to await the promise rejection
    await expect(async () => await controller.update(title, description))
      .rejects.toThrow('The achievement could not be updated');
  });

it('should throw an error when any database operation fails', async () => {
const errorMessage = 'Database error';

// Mock the database query to throw an error
require('../../db/index.js').db.query.mockRejectedValueOnce(new Error(errorMessage));

const controller = new AchievementController();
await expect(controller.insert('Test', 'Description')).rejects.toThrow(errorMessage);
});
});
