const db = require("../db");

const insertCompound = async (playersEmail, gamesAccessKey) => {
    try {
        const query = `INSERT INTO Compound (Players_email, Games_accessKey) VALUES ($1, $2)`;
        const result = await db.query(query, [playersEmail, gamesAccessKey]);
        return result;
    } catch (error) {
        throw error;
    }
};

const deleteCompound = async (playersEmail, gamesAccessKey) => {
    try {
        const query = `DELETE FROM Compound WHERE Players_email = $1 AND Games_accessKey = $2`;
        const result = await db.query(query, [playersEmail, gamesAccessKey]);
        return result;
    } catch (error) {
        throw error;
    }
};

const selectCompound = async (playersEmail, gamesAccessKey) => {
    try {
        const query = `SELECT * FROM Compound WHERE Players_email = $1 AND Games_accessKey = $2`;
        const result = await db.query(query, [playersEmail, gamesAccessKey]);
        return result;
    } catch (error) {
        throw error;
    }
};

const selectAllCompounds = async () => {
    try {
        const query = `SELECT * FROM Compound`;
        const result = await db.query(query);
        return result;
    } catch (error) {
        throw error;
    }
};

module.exports = {
    insertCompound,
    deleteCompound,
    selectCompound,
    selectAllCompounds
};
