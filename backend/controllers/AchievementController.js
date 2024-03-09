const { db } = require("../db/index");

class AchievementController {
    async insert(title, description) {
        try {
            const query = `INSERT INTO Achievement (title, description) VALUES($1, $2)`;
            const values = [title, description];
            const result = await db.query(query, values);
            return result;
        } catch (error) {
            throw error;
        }
    }

    async selectAll() {
        try {
            const query = `SELECT * FROM Achievement`;
            const result = await db.query(query);
            return result;
        } catch (error) {
            throw error;
        }  
    }

    async remove(title) {
        try {
            const query = `DELETE FROM Achievement WHERE title = $1`;
            const result = await db.query(query, [title]);
            return result;
        } catch (error) {
            throw error;
        }  
    }

    async update(title, description) {
        try {
            const query = `UPDATE Achievement SET description = $1 WHERE title = $2`;
            const values = [description, title];
            const result = await db.query(query, values);
            if (!result || !Array.isArray(result) || result.rowCount === 0) {
                throw new Error('The achievement could not be updated');
            } else {
                return result.rows[0];
            }
        } catch (error) {
            throw error;
        }  
    }
};

module.exports = AchievementController;