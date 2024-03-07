const { db, closeDb } = require("./ConnectionManager");
const ObtainsVO = require('./ObtainsVO');

class ObtainsDAO {
    async insert(ObtainsVO) {
        try {
            const query = `INSERT INTO obtains (gameId, playerId) VALUES(?, ?)`;
            const values = [ObtainsVO.gameId, ObtainsVO.playerId];
            const client = await dbConnect();
            const result = await db.query(query, values);
            return result;
        } catch (error) {
            throw error;
        } finally {
            closeDb(client);
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

    async update(ObtainsVO) {
        try {
            const query = `UPDATE obtains SET gameId = ?, playerId = ? WHERE id = ?`;
            const values = [ObtainsVO.gameId, ObtainsVO.playerId, ObtainsVO.id];
            const result = await db.query(query, values);
            if (!result || !Array.isArray(result) || result.length === 0) {
                throw new Error(`No se ha podido actualizar el obtains con id ${ObtainsVO.id}`);
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