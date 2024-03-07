const AchievementDAO = require('./AchievementDAO');
const AchievementVO = require('./AchievementVO');
const { db, closeDb } = require("./ConnectionManager");

jest.mock('./ConnectionManager');

describe('AchievementDAO', () => {
    let achievementDAO;
    let mockDb;

    beforeEach(() => {
        achievementDAO = new AchievementDAO();
        mockDb = {
            query: jest.fn(),
        };
        db.mockReturnValue(mockDb);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should insert an achievement', async () => {
        const achievement = new AchievementVO();
        achievement.name = 'Test';
        achievement.description = 'Test description';

        await achievementDAO.insert(achievement);

        expect(mockDb.query).toHaveBeenCalledWith(
            'INSERT INTO achievement (name, description) VALUES(?, ?)',
            [achievement.name, achievement.description]
        );
    });

    it('should select all achievements', async () => {
        await achievementDAO.selectAll();

        expect(mockDb.query).toHaveBeenCalledWith('SELECT * FROM achievement');
    });

    it('should remove an achievement by id', async () => {
        const id = 1;

        await achievementDAO.remove(id);

        expect(mockDb.query).toHaveBeenCalledWith(
            'DELETE FROM achievement WHERE id = ?',
            [id]
        );
    });

    it('should update an achievement', async () => {
        const achievement = new AchievementVO();
        achievement.id = 1;
        achievement.name = 'Updated Test';
        achievement.description = 'Updated Test description';

        await achievementDAO.update(achievement);

        expect(mockDb.query).toHaveBeenCalledWith(
            'UPDATE achievement SET name = ?, description = ? WHERE id = ?',
            [achievement.name, achievement.description, achievement.id]
        );
    });
});
