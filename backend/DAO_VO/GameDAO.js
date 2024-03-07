const { db, closeDb } = require("./ConnectionManager");
const GameVO = require('./GameVO');

class GameDAO{
    async insert(GameVO){
        try{
            const query = `INSERT INTO game (name, description, price, rating, releaseDate) VALUES (?, ?, ?, ?, ?)`;
            const values = [GameVO.name, GameVO.description, GameVO.price, GameVO.rating, GameVO.releaseDate];
            const client = await dbConnect();
            const result = await db.query(query, values);
            return result;
        }catch(error){
            throw error;
        } finally {
            closeDb(client);
        }
    }
    async update(GameVO){
        try{
            const query = `UPDATE game SET name = ?, description = ?, price = ?, rating = ?, releaseDate = ? WHERE id = ?`;
            const values = [GameVO.name, GameVO.description, GameVO.price, GameVO.rating, GameVO.releaseDate, GameVO.id];
            const result = await db.query(query, values);
            if (!result || !Array.isArray(result) || result.length === 0) {
                throw new Error(`No game found with id ${GameVO.id}`);
            } else {
                return result[0];
            }
        }catch(error){
            throw error;
        } finally {
            closeDb();
        }
    }
    async delete(id){
        try{
            const query = `DELETE FROM game WHERE id = ?`;
            const result = await db.query(query, [id]);
            return result;
        }catch(error){
            throw error;
        } finally {
            closeDb();
        }
    }
    async select(id){
        try{
            const query = `SELECT * FROM game WHERE id = ?`;
            const result = await db.query(query, [id]);
            return result;
        }catch(error){
            throw error;
        } finally {
            closeDb();
        }
    }
    async selectAll(){
        try{
            const query = `SELECT * FROM game`;
            const result = await db.query(query);
            return result;
        }catch(error){
            throw error;
        } finally {
            closeDb();
        }
    }
}

module.exports = GameDAO;