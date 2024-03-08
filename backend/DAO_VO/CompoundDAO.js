const { db, closeDb } = require("./ConnectionManager");
const CompoundVO = require('./CompoundVO');

class CompoundDAO{
    async insert(CompoundVO){
        try{
            const query = `INSERT INTO compound (Players_email, Games_accessKey) VALUES (?, ?)`;
            const values = [CompoundVO.Players_email, CompoundVO.Games_accessKey];
            const client = await dbConnect();
            const result = await db.query(query, values);
            return result;
        }catch(error){
            throw error;
        } finally {
            closeDb(client);
        }
    }
    async update(CompoundVO){
        try{
            const query = `UPDATE compound SET Players_email = ?, Games_accessKey = ? WHERE id = ?`;
            const values = [CompoundVO.Players_email, CompoundVO.Games_accessKey, CompoundVO.id];
            const client = await dbConnect();
            const result = await db.query(query, values);
            if (!result || !Array.isArray(result) || result.length === 0) {
                throw new Error('No se ha podido actualizar el Compound');
            } else {
                return this._buildCompoundVO(result[0]);
            }
            return result;
        }catch(error){
            throw error;
        } finally {
            closeDb(client);
        }
    }
    async delete(id){
        try{
            const query = `DELETE FROM compound WHERE id = ?`;
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
            const query = `SELECT * FROM compound WHERE id = ?`;
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
            const query = `SELECT * FROM compound`;
            const client = await dbConnect();
            const result = await db.query(query);
            return result;
        }catch(error){
            throw error;
        } finally {
            closeDb(client);
        }
    }
};

module.exports = CompoundDAO;