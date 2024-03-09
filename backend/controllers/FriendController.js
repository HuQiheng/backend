const { db } = require("../db/index");

class FriendDAO {
    async insert(name, email) {
        try {
            const query = `INSERT INTO friend (name, email) VALUES(?, ?)`; // 1.2.3.4       
            const values = [name, email];
            const result = await db.query(query, values);
            return result;
        } catch (error) {
            throw error;
        }  
    }

    async selectAll() {
        try {
            const query = `SELECT * FROM friend`;
            const result = await db.query(query);
            return result;
        } catch (error) {
            throw error;
        }  
    }
    
    async remove(id) {
        try {
            const query = `DELETE FROM friend WHERE id = ?`;
            const result = await db.query(query, [id]);
            return result;
        } catch (error) {
            throw error;
        }  
    }
};

module.exports = FriendDAO;