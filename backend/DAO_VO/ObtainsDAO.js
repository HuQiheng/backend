const { db, closeDb } = require("./ConnectionManager");
const ObtainsVO = require('./ObtainsVO');

class ObtainsDAO {
    async insert(ObtainsVO) {
        try {
            const query = `INSERT INTO obtains (obtained, Achievements_title, Players_email) VALUES (?, ?, ?)`;
            const values = [ObtainsVO.obtained, ObtainsVO.Achievements_title, ObtainsVO.Players_email];
            const client = await dbConnect();
            const result = await db.query(query, values);
            return result;
        } catch (err) {
            throw err;
        } finally {
            closeDb(client);
        }
    }

    async selectAll() {
        try {
            const query = `SELECT * FROM obtains`;
            const client = await dbConnect();
            const result = await db.query(query);
            return result;
        } catch (error) {
            throw error;
        } finally {
            closeDb(client);
        }
    }

    /**
     * @param {string} id - The id of the obtains to delete.
     */
    async removeById(id) {
        try {
            const query = `DELETE FROM obtains WHERE id = ?`;
            const client = await dbConnect();
            const result = await db.query(query, [id]);
            return result;
        } catch (error) {
            throw error;
        } finally {
            closeDb(client);
        }
    }

    async update(ObtainsVO) {
        try {
            const query = `UPDATE obtains SET obtained = ?, Achievements_title = ?, Players_email = ? WHERE id = ?`;
            const values = [ObtainsVO.obtained, ObtainsVO.Achievements_title, ObtainsVO.Players_email, ObtainsVO.id];
            const client = await dbConnect();
            const result = await db.query(query, values);
            return result;
        } catch (error) {
            throw error;
        } finally {
            closeDb(client);
        }
    }       
};

module.exports = ObtainsDAO;