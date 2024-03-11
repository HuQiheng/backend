const { db } = require("../db/index");

class FriendController {
    async insert(player_email1, player_email2) {
        try {
            const query = `INSERT INTO friend (Player_email1, Player_email2) VALUES(?, ?)`; // 1.2.3.4       
            const values = [player_email1, player_email2];
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
    
    async remove(player_email2) {
        try {
            const query = `DELETE FROM friend WHERE Player_email2 = ?`;
            const result = await db.query(query, [player_email2]);
            return result;
        } catch (error) {
            throw error;
        }  
    }
};

module.exports = FriendController;