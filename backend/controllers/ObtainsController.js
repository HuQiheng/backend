const { db } = require("../db/index");

class ObtainsController {
    async insert(obtainsVO) {
        try {
            const query = `INSERT INTO Obtains (obtained, Achievements_title, Players_email) VALUES($1, $2, $3)`;
            const values = [obtainsVO.obtained, obtainsVO.Achievements_title, obtainsVO.Players_email];
            const result = await db.query(query, values);
            return result;
        } catch (error) {
            throw error;
        }  
    }

    async selectAll() {
        try {
            const query = `SELECT * FROM Obtains`;
            const result = await db.query(query);
            return result;
        } catch (error) {
            throw error;
        }  
    }

    async removeById(Achievements_title, Players_email) {
        try {
            const query = `DELETE FROM Obtains WHERE Achievements_title = $1 AND Players_email = $2`;
            const result = await db.query(query, [Achievements_title, Players_email]);
            return result;
        } catch (error) {
            throw error;
        }  
    }

    async update(obtainsVO) {
        try {
            const query = `UPDATE Obtains SET obtained = $1 WHERE Achievements_title = $2 AND Players_email = $3`;
            const values = [obtainsVO.obtained, obtainsVO.Achievements_title, obtainsVO.Players_email];
            const result = await db.query(query, values);
            if (!result || !Array.isArray(result) || result.length === 0) {
                throw new Error(`No se ha podido actualizar el obtains con Achievements_title ${obtainsVO.Achievements_title} y Players_email ${obtainsVO.Players_email}`);
            } else {
                return result;
            }
        } catch (error) {
            throw error;
        }  
    }       
};
module.exports = ObtainsController;