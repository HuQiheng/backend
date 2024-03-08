const { db, closeDb } = require("./ConnectionManager");
const PlayerVO = require('./PlayerVO');

class PlayerDAO {
    async insert(PlayerVO) {
        try {
            const query = `INSERT INTO player (email, username, passwd) VALUES (?, ?, ?)`;
            const values = [PlayerVO.email, PlayerVO.username, PlayerVO.passwd];
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
            const query = `UPDATE player SET email = ?, username = ?, passwd = ? WHERE id = ?`;
            const values = [PlayerVO.email, PlayerVO.username, PlayerVO.passwd, PlayerVO.id];
            const client = await dbConnect();
            const result = await db.query(query, values);
            return result;
        } catch (error) {
            throw error;
        } finally {
            closeDb(client);
        }
    }

    async delete(id) {
        try {
            const query = `DELETE FROM player WHERE id = ?`;
            const client = await dbConnect();
            const result = await db.query(query, [id]);
            return result;
        } catch (error) {
            throw error;
        } finally {
            closeDb(client);
        }
    }

    async select(id) {
        try {
            const query = `SELECT * FROM player WHERE id = ?`;
            const client = await dbConnect();
            const result = await db.query(query, [id]);
            return result;
        } catch (error) {
            throw error;
        } finally {
            closeDb(client);
        }
    }

    async selectAll() {
        try {
            const query = `SELECT * FROM player`;
            const client = await dbConnect();
            const result = await db.query(query);
            return result;
        } catch (error) {
            throw error;
        } finally {
            closeDb(client);
        }
    }
}

module.exports = PlayerDAO;
   