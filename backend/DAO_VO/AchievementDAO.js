const { dbConnect, dbClose } = require("./ConnectionManager");
const AchievementVO = require('./AchievementVO');

class AchievementDAO {
    async insert(AchievementVO) {
        try {
            const query = `INSERT INTO achievement (name, description) VALUES(?, ?)`;
            const values = [AchievementVO.name, AchievementVO.description];
            const client = await dbConnect();
            const result = await client.query(query, values);
            return result;
        } catch (error) {
            throw error;
        } finally {
            dbClose(client);
        }
    }

    async selectAll() {
        try {
            const query = `SELECT * FROM achievement`;
            const result = await dbConnect.query(query);
            return result;
        } catch (error) {
            throw error;
        } finally {
            dbClose();
        }
    }

    /**
     * @param {number} id - The id of the achievement to delete.
     */
    async remove(id) {
        try {
            const query = `DELETE FROM achievement WHERE id = ?`;
            const result = await dbConnect.query(query, [id]);
            return result;
        } catch (error) {
            throw error;
        } finally {
            dbClose();
        }
    }

    async update(AchievementVO) {
        try {
            const query = `UPDATE achievement SET name = ?, description = ? WHERE id = ?`;
            const values = [AchievementVO.name, AchievementVO.description
                , AchievementVO.id];
            const result = await dbConnect.query(query, values);
            if (!result || !Array.isArray(result) || result.length === 0) {
                throw new Error('No se ha podido actualizar el achievement');
            } else {
                return this._buildAchievementVO(result[0]);
            }
        } catch (error) {
            throw error;
        } finally {
            dbClose();
        }
    }
};

module.exports = AchievementDAO;