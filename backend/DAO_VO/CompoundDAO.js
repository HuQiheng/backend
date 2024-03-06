const { db, closeDb } = require("./ConnectionManager");
const CompoundVO = require('./CompoundVO');

class CompoundDAO{
    async insert(compoundVO){
        try{
            const query = `INSERT INTO compound (name, description, price, rating, releaseDate) VALUES (?, ?, ?, ?, ?)`;
            const values = [compoundVO.name, compoundVO.description, compoundVO.price, compoundVO.rating, compoundVO.releaseDate];
            const result = await db.query(query, values);
            return result;
        }catch(error){
            throw error;
        }
    }
    async update(compoundVO){
        try{
            const query = `UPDATE compound SET name = ?, description = ?, price = ?, rating = ?, releaseDate = ? WHERE id = ?`;
            const values = [compoundVO.name, compoundVO.description, compoundVO.price, compoundVO.rating, compoundVO.releaseDate, compoundVO.id];
            const result = await db.query(query, values);
            return result;
        }catch(error){
            throw error;
        }
    }
    async delete(id){
        try{
            const query = `DELETE FROM compound WHERE id = ?`;
            const result = await db.query(query, [id]);
            return result;
        }catch(error){
            throw error;
        }
    }
    async select(id){
        try{
            const query = `SELECT * FROM compound WHERE id = ?`;
            const result = await db.query(query, [id]);
            return result;
        }catch(error){
            throw error;
        }
    }
    async selectAll(){
        try{
            const query = `SELECT * FROM compound`;
            const result = await db.query(query);
            return result;
        }catch(error){
            throw error;
        }
    }
};

module.exports = CompoundDAO;