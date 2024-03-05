const { db, closeDb } = require("./ConnectionManager");
const PlayerVO = require('./PlayerVO');

class PlayerDAO {
    async insert(playerVO) {
        try {
            const query = `INSERT INTO player (name, age, position) VALUES (?, ?, ?)`;
            const values = [playerVO.name, playerVO.age, playerVO.position];
            const result = await db.query(query, values);
            return result;
        } catch (error) {
            throw error;
        }
    }

    async update(playerVO) {
        try {
            const query = `UPDATE player SET name = ?, age = ?, position = ? WHERE id = ?`;
            const values = [playerVO.name, playerVO.age, playerVO.position, playerVO.id];
            const result = await db.query(query, values);
            return result;
        } catch (error) {
            throw error;
        }
    }

    async delete(id) {
        try {
            const query = `DELETE FROM player WHERE id = ?`;
            const result = await db.query(query, [id]);
            return result;
        } catch (error) {
            throw error;
        }
    }

    async select(id) {
        try {
            const query = `SELECT * FROM player WHERE id = ?`;
            const result = await db.query(query, [id]);
            return result;
        } catch (error) {
            throw error;
        }
    }

    async selectAll() {
        try {
            const query = `SELECT * FROM player`;
            const result = await db.query(query);
            return result;
        } catch (error) {
            throw error;
        }
    }
    async verificarCredenciales(playerVO) {
        const query = 'SELECT * FROM Player WHERE email = $1 AND password = $2';
        const values = [email, password];
        try {
            const res = await pool.query(query, values);
            return res.rowCount == 1; // Devuelve true si hay una fila que cumple las condiciones
        } catch (err) {
            console.error('Error al verificar las credenciales del usuario:', err);
            throw err;
        }
    }
}

module.exports = PlayerDAO;
   
