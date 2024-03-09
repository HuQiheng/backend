const { db } = require("../db/index");

class PlayerDAO {
    async insert(playerVO) {
        try {
            const query = `INSERT INTO Player (email, username, password) VALUES ($1, $2, $3)`;
            const values = [playerVO.email, playerVO.username, playerVO.password];
            const result = await db.query(query, values);
            return result;
        } catch (error) {
            throw error;
        }
    }

    async update(playerVO) {
        try {
            const query = `UPDATE Player SET username = $1, password = $2 WHERE email = $3`;
            const values = [playerVO.username, playerVO.password, playerVO.email];
            const result = await db.query(query, values);
            return result;
        } catch (error) {
            throw error;
        }
    }

    async delete(email) {
        try {
            const query = `DELETE FROM Player WHERE email = $1`;
            const result = await db.query(query, [email]);
            return result;
        } catch (error) {
            throw error;
        }
    }

    async select(email) {
        try {
            const query = `SELECT * FROM Player WHERE email = $1`;
            const result = await db.query(query, [email]);
            return result;
        } catch (error) {
            throw error;
        }
    }

    async selectAll() {
        try {
            const query = `SELECT * FROM Player`;
            const result = await db.query(query);
            return result;
        } catch (error) {
            throw error;
        }
    }

    async verificarCredenciales(email, password) {
        const query = 'SELECT * FROM Player WHERE email = $1 AND password = $2';
        const values = [email, password];
        try {
            const res = await db.query(query, values);
            return res.rowCount == 1; // Devuelve true si hay una fila que cumple las condiciones
        } catch (err) {
            console.error('Error al verificar las credenciales del usuario:', err);
            throw err;
        }
    }
}

module.exports = PlayerDAO;