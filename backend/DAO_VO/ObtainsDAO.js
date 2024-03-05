const { db, closeDb } = require("./ConnectionManager");
const ObtainsVO = require('./ObtainsVO');

class ObtainsDAO {
    async insert(obtainsVO) {
        try {
            const query = `INSERT INTO obtains (gameId, playerId) VALUES(?, ?)`;
            const values = [obtainsVO.gameId, obtainsVO.playerId];
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
            const query = `SELECT * FROM obtains`;
            const result = await db.query(query);
            return result;
        } catch (error) {
            throw error;
        } finally {
            closeDb();
        }
    }

    /**
     * @param {string} id - The id of the obtains to delete.
     */
    async removeById(id) {
        try {
            const query = `DELETE FROM obtains WHERE id = ?`;
            const result = await db.query(query, [id]);
            return result;
        } catch (error) {
            throw error;
        } finally {
            closeDb();
        }
    }

    async update(obtainsVO) {
        try {
            const query = `UPDATE obtains SET gameId = ?, playerId = ? WHERE id = ?`;
            const values = [obtainsVO.gameId, obtainsVO.playerId, obtainsVO.id];
            const result = await db.query(query, values);
            if (!result || !Array.isArray(result) || result.length === 0) {
                throw new Error(`No se ha podido actualizar el obtains con id ${obtainsVO.id}`);
            } else {
                return result;
            }
        } catch (error) {
            throw error;
        } finally {
            closeDb();
        }
    }       
};
module.exports = ObtainsDAO;