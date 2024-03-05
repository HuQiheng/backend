const { db, closeDb } = require("./ConnectionManager");
const AchievementVO = require('./AchievementVO');

class AchievementDAO {
    async insert(achievementVO) {
        try {
            const query = `INSERT INTO achievement (name, description) VALUES(?, ?)`;
            const values = [achievementVO.name, achievementVO.description];
            const result = await db.query(query, values);
            return result;
        } catch (error) {
            throw error;
        } finally {
            closeDb();
        }
    }

    async selectAll() {
        try {
            const query = `SELECT * FROM achievement`;
            const result = await db.query(query);
            return result;
        } catch (error) {
            throw error;
        } finally {
            closeDb();
        }
    }

    /**
     * @param {number} id - The id of the achievement to delete.
     */
    async remove(id) {
        try {
            const query = `DELETE FROM achievement WHERE id = ?`;
            const result = await db.query(query, [id]);
            return result;
        } catch (error) {
            throw error;
        } finally {
            closeDb();
        }
    }

    async update(achievementVO) {
        try {
            const query = `UPDATE achievement SET name = ?, description = ? WHERE id = ?`;
            const values = [achievementVO.name, achievementVO.description
                , achievementVO.id];
            const result = await db.query(query, values);
            if (!result || !Array.isArray(result) || result.length === 0) {
                throw new Error('No se ha podido actualizar el achievement');
            } else {
                return this._buildAchievementVO(result[0]);
            }
        } catch (error) {
            throw error;
        } finally {
            closeDb();
        }
    }
};

module.exports = AchievementDAO;