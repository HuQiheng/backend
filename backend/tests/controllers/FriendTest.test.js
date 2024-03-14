// friendController.test.js
const db = require('../../db/index');
const {
    insertFriend,
    selectAllFriends,
    removeFriend
} = require('../../controllers/FriendController');

jest.mock('../../db/index');

describe('Friend Controller', () => {
    afterEach(() => {
        // Clear mock implementation after each test
        db.query.mockReset();
    });

    test('Insert Friend', async () => {
        const player_email1 = 'email1@example.com';
        const player_email2 = 'email2@example.com';
        const mockResult = { rows: [] };
        db.query.mockResolvedValueOnce(mockResult);

        const result = await insertFriend(player_email1, player_email2);

        expect(db.query).toHaveBeenCalledWith(expect.any(String), [player_email1, player_email2]);
        expect(result).toEqual(mockResult);
    });

    test('Select All Friends', async () => {
      // Define mock data for friends
      const mockFriends = [
          { id: 1, player_email1: 'test1@example.com', player_email2: 'test2@example.com' },
          { id: 2, player_email1: 'test3@example.com', player_email2: 'test4@example.com' }
      ];
  
      // Mock result for selecting all friends
      const mockResult = { rows: mockFriends };
      db.query.mockResolvedValueOnce(mockResult);
  
      // Call the selectAllFriends function
      const result = await selectAllFriends();
  
      // Verify that db.query was called with the correct SQL query
      expect(db.query).toHaveBeenCalledWith(expect.any(String));
  
      // Verify that the result returned by selectAllFriends matches the expected result
      expect(result).toEqual(mockResult);
  });
  

  test('Remove Friend', async () => {
    // Define the test data
    const player_email2 = 'email2@example.com';

    // Mock result for inserting a friend (assuming one friend was successfully inserted)
    const insertMockResult = { rowCount: 1 };
    db.query.mockResolvedValueOnce(insertMockResult);

    // Insert the mock friend
    await insertFriend('email1@example.com', player_email2);

    // Mock result for removing the friend
    const removeMockResult = { rowCount: 1 }; // Assuming one friend was successfully removed
    db.query.mockResolvedValueOnce(removeMockResult);

    // Call the removeFriend function
    const result = await removeFriend(player_email2);

    // Verify that db.query was called with the correct SQL query and parameters
    expect(db.query).toHaveBeenCalledWith(expect.any(String), [player_email2]);

    // Verify that the result returned by removeFriend matches the expected result
    expect(result).toEqual(removeMockResult);
});

});
