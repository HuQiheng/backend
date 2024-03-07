const { db, closeDb } = require("./ConnectionManager");
const FriendVO = require('./FriendVO');

class FriendDAO {
    async insert(FriendVO) {
        try {
            const query = `INSERT INTO friend (name, email) VALUES(?, ?)`; // 1.2.3.4       
            const values = [FriendVO.name, FriendVO.email];
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
            const query = `SELECT * FROM friend`;
            const result = await db.query(query);
            return result;
        } catch (error) {
            throw error;
        } finally {
            closeDb();
        }
    }
    
    /**
     * @param {string} id - The id of the friend to delete.
     */
    async remove(id) {
        try {
            const query = `DELETE FROM friend WHERE id = ?`;
            const result = await db.query(query, [id]);
            return result;
        } catch (error) {
            throw error;
        } finally {
            closeDb();
        }
    }
};

module.exports = FriendDAO;