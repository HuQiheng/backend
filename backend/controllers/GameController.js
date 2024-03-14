const db = require("../db/index");

const insertGame = async (accessKey, ranking, date) => {
    try {
        const query = `INSERT INTO Game (accessKey, ranking, date) VALUES ($1, $2, $3)`;
        const values = [accessKey, ranking, date];
        const result = await db.query(query, values);
        return result;
    } catch (error) {
        throw error;
    }
};

const updateGame = async (accessKey, ranking, date) => {
    try {
        const query = `UPDATE Game SET ranking = $1, date = $2 WHERE accessKey = $3`;
        const values = [ranking, date, accessKey];
        const result = await db.query(query, values);
        return result;
    } catch (error) {
        throw error;
    }
};

const deleteGame = async (accessKey) => {
    try {
        const query = `DELETE FROM Game WHERE accessKey = $1`;
        const result = await db.query(query, [accessKey]);
        return result;
    } catch (error) {
        throw error;
    }
};

const selectGame = async (accessKey) => {
    try {
        const query = `SELECT * FROM Game WHERE accessKey = $1`;
        const result = await db.query(query, [accessKey]);
        return result;
    } catch (error) {
        throw error;
    }
};

const selectAllGames = async () => {
    try {
        const query = `SELECT * FROM Game`;
        const result = await db.query(query);
        return result;
    } catch (error) {
        throw error;
    }
};

module.exports = {
    insertGame,
    updateGame,
    deleteGame,
    selectGame,
    selectAllGames
};
