// achievementController.test.js
const {
  insertAchievement,
  selectAllAchievements,
  removeAchievement,
  updateAchievement,
} = require('../../controllers/AchievementController');

// Mocking the database query function for testing
jest.mock('../../db/index', () => ({
  query: jest.fn(),
}));

const db = require('../../db/index');

describe('Achievement Controller', () => {
  afterEach(() => {
    // Clear mock implementation after each test
    jest.clearAllMocks();
  });

  test('Insert Achievement', async () => {
    const title = 'Achievement Title';
    const description = 'Achievement Description';
    const mockResult = { rows: [] };
    db.query.mockResolvedValueOnce(mockResult);

    const result = await insertAchievement(title, description);

    expect(db.query).toHaveBeenCalledWith(expect.any(String), [title, description]);
    expect(result).toEqual(mockResult);
  });

  test('Select All Achievements', async () => {
    // Define mock data to be inserted
    const achievement1 = { id: 1, title: 'Achievement 1', description: 'Description 1' };
    const achievement2 = { id: 2, title: 'Achievement 2', description: 'Description 2' };

    // Mock result for insertion
    const insertMockResult = { rowCount: 2 }; // Assuming two achievements were inserted
    db.query.mockResolvedValueOnce(insertMockResult);

    // Insert the mock data
    await insertAchievement(achievement1.title, achievement1.description);
    await insertAchievement(achievement2.title, achievement2.description);

    // Mock result for selection
    const selectMockResult = { rows: [achievement1, achievement2] };
    db.query.mockResolvedValueOnce(selectMockResult);

    // Call the selectAllAchievements function
    const result = await selectAllAchievements();

    // Verify that the insertAchievement function was called twice
    expect(db.query).toHaveBeenCalledTimes(3);

    // Verify that the selectAllAchievements function was called with the correct arguments
    expect(db.query).toHaveBeenCalledWith(expect.any(String));

    // Verify that the result returned by selectAllAchievements matches the expected result
    expect(result).toEqual(selectMockResult);
  });

  test('Remove Achievement', async () => {
    // Define mock data for the achievement to be inserted
    const title = 'Achievement Title';
    const description = 'Achievement Description';

    // Mock result for insertion
    const insertMockResult = { rowCount: 1 }; // Assuming one achievement was inserted
    db.query.mockResolvedValueOnce(insertMockResult);

    // Insert the mock achievement
    await insertAchievement(title, description);

    // Mock result for removal
    const removeMockResult = { rowCount: 1 }; // Assuming one achievement was removed
    db.query.mockResolvedValueOnce(removeMockResult);

    // Call the removeAchievement function
    const result = await removeAchievement(title);

    // Verify that the insertAchievement function was called once
    expect(db.query).toHaveBeenCalledTimes(2);

    // Verify that the removeAchievement function was called with the correct arguments
    expect(db.query).toHaveBeenCalledWith(expect.any(String), [title]);

    // Verify that the result returned by removeAchievement matches the expected result
    expect(result).toEqual(removeMockResult);
  });

  test('Update Achievement', async () => {
    // Define mock data for the achievement to be inserted
    const title = 'Achievement Title';
    const description = 'Achievement Description';

    // Mock result for insertion
    const insertMockResult = { rowCount: 1 }; // Assuming one achievement was inserted
    db.query.mockResolvedValueOnce(insertMockResult);

    // Insert the mock achievement
    await insertAchievement(title, description);

    // Mock result for update
    const updateMockResult = { rowCount: 1, rows: [{}] }; // Assuming one achievement was updated
    db.query.mockResolvedValueOnce(updateMockResult);

    // Call the updateAchievement function
    const result = await updateAchievement(title, 'New Description');

    // Verify that the insertAchievement function was called once before calling updateAchievement
    expect(db.query).toHaveBeenCalledTimes(2);

    // Verify that the updateAchievement function was called with the correct arguments
    expect(db.query).toHaveBeenCalledWith(expect.any(String), ['New Description', title]);

    // Verify that the result returned by updateAchievement matches the expected result
    expect(result).toEqual(updateMockResult.rows[0]);
  });
});
