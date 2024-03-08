const { db, closeDb } = require("./ConnectionManager");
const GameVO = require('./GameVO');

class GameDAO{
    async insert(GameVO){
        try{
            const query = `INSERT INTO game (accessKey, ranking, date) VALUES (?, ?, ?)`;
            const values = [GameVO.accessKey, GameVO.ranking, GameVO.date];
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
            const query = `UPDATE game SET accessKey = ?, ranking = ?, date = ? WHERE id = ?`;
            const values = [GameVO.accessKey, GameVO.ranking, GameVO.date, GameVO.id];
            const client = await dbConnect();
            const result = await db.query(query, values);
            if (!result || !Array.isArray(result) || result.length === 0) {
                throw new Error(`No game found with id ${GameVO.id}`);
            } else {
                return result[0];
            }
        }catch(error){
            throw error;
        } finally {
            closeDb(client);
        }
    }
    async delete(id){
        try{
            const query = `DELETE FROM game WHERE id = ?`;
            const client = await dbConnect();
            const result = await db.query(query, [id]);
            return result;
        }catch(error){
            throw error;
        } finally {
            closeDb(client);
        }
    }
    async select(id){
        try{
            const query = `SELECT * FROM game WHERE id = ?`;
            const client = await dbConnect();
            const result = await db.query(query, [id]);
            return result;
        }catch(error){
            throw error;
        } finally {
            closeDb(client);
        }
    }
    async selectAll(){
        try{
            const query = `SELECT * FROM game`;
            const client = await dbConnect();
            const result = await db.query(query);
            return result;
        }catch(error){
            throw error;
        } finally {
            closeDb(client);
        }
    }
}

module.exports = GameDAO;