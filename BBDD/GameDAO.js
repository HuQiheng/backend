const { db, closeDb } = require("./ConnectionManager");
const GameVO = require('./GameVO');

class GameDAO{
    async insert(gameVO){
        try{
            const query = `INSERT INTO game (name, description, price, rating, releaseDate) VALUES (?, ?, ?, ?, ?)`;
            const values = [gameVO.name, gameVO.description, gameVO.price, gameVO.rating, gameVO.releaseDate];
            const result = await db.query(query, values);
            return result;
        }catch(error){
            throw error;
        }
    }
    async update(gameVO){
        try{
            const query = `UPDATE game SET name = ?, description = ?, price = ?, rating = ?, releaseDate = ? WHERE id = ?`;
            const values = [gameVO.name, gameVO.description, gameVO.price, gameVO.rating, gameVO.releaseDate, gameVO.id];
            const result = await db.query(query, values);
            return result;
        }catch(error){
            throw error;
        }
    }
    async delete(id){
        try{
            const query = `DELETE FROM game WHERE id = ?`;
            const result = await db.query(query, [id]);
            return result;
        }catch(error){
            throw error;
        }
    }
    async select(id){
        try{
            const query = `SELECT * FROM game WHERE id = ?`;
            const result = await db.query(query, [id]);
            return result;
        }catch(error){
            throw error;
        }
    }
    async selectAll(){
        try{
            const query = `SELECT * FROM game`;
            const result = await db.query(query);
            return result;
        }catch(error){
            throw error;
        }
    }
}

module.exports = GameDAO;