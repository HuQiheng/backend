const { db, closeDb } = require("./ConnectionManager");
const PlayerVO = require('./PlayerVO');

class PlayerDAO {
    async insert(PlayerVO) {
        try {
            const query = `INSERT INTO player (name, age, position) VALUES (?, ?, ?)`;
            const values = [PlayerVO.name, PlayerVO.age, PlayerVO.position];
            const client = await dbConnect();
            const result = await db.query(query, values);
            return result;
        } catch (error) {
            throw error;
        } finally {
            closeDb(client);
        }
    }

    async update(PlayerVO) {
        try {
            const query = `UPDATE player SET name = ?, age = ?, position = ? WHERE id = ?`;
            const values = [PlayerVO.name, PlayerVO.age, PlayerVO.position, PlayerVO.id];
            const result = await db.query(query, values);
            if (!result || !Array.isArray(result) || result.length === 0) {
                throw new Error('No se ha podido actualizar el Player');
            } else {
                return this._buildPlayerVO(result[0]);
            }
        } catch (error) {
            throw error;
        } finally {
            closeDb();
        }
    }

    async delete(id) {
        try {
            const query = `DELETE FROM player WHERE id = ?`;
            const result = await db.query(query, [id]);
            return result;
        } catch (error) {
            throw error;
        } finally {
            closeDb();
        }
    }

    async select(id) {
        try {
            const query = `SELECT * FROM player WHERE id = ?`;
            const result = await db.query(query, [id]);
            return result;
        } catch (error) {
            throw error;
        } finally {
            closeDb();
        }
    }

    async selectAll() {
        try {
            const query = `SELECT * FROM player`;
            const result = await db.query(query);
            return result;
        } catch (error) {
            throw error;
        } finally {
            closeDb();
        }
    }
}

module.exports = PlayerDAO;
   