const { db } = require("../db/index");

class CompoundDAO {
    async insert(playersEmail, gamesAccessKey) {
        try {
            const query = `INSERT INTO Compound (Players_email, Games_accessKey) VALUES ($1, $2)`;
            const values = [playersEmail, gamesAccessKey];
            const result = await db.query(query, values);
            return result;
        } catch (error) {
            throw error;
        }
    }

    async delete(playersEmail, gamesAccessKey){
        try{
            const query = `DELETE FROM Compound WHERE Players_email = $1 AND Games_accessKey = $2`;
            const values = [playersEmail, gamesAccessKey];
            const result = await db.query(query, values);
            return result;
        }catch(error){
            throw error;
        }
    }

    async select(playersEmail, gamesAccessKey){
        try{
            const query = `SELECT * FROM Compound WHERE Players_email = $1 AND Games_accessKey = $2`;
            const values = [playersEmail, gamesAccessKey];
            const result = await db.query(query, values);
            return result;
        }catch(error){
            throw error;
        }
    }

    async selectAll(){
        try{
            const query = `SELECT * FROM Compound`;
            const result = await db.query(query);
            return result;
        }catch(error){
            throw error;
        }
    }
};

module.exports = CompoundDAO;