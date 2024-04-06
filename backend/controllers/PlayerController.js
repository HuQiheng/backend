const db = require('../db/index.js');

const insertPlayer = async (email, username, password, picture) => {
  try {
    const query = `INSERT INTO Player (email, username, password, picture) VALUES ($1, $2, $3, $4)`;
    const values = [email, username, password, picture];
    const result = await db.query(query, values);
    return result;
  } catch (error) {
    throw error;
  }
};

const updatePlayer = async (email, username, password, picture) => {
  try {
    const query = `UPDATE Player SET username = $2, password = $3, picture = $4 WHERE email = $1 RETURNING *`;
    const values = [email, username, password, picture];
    const result = await db.query(query, values);
    return result;
  } catch (error) {
    throw error;
  }
};

const deletePlayer = async (email) => {
  try {
    const query = `DELETE FROM Player WHERE email = $1`;
    const result = await db.query(query, [email]);
    return result;
  } catch (error) {
    throw error;
  }
};

const selectPlayer = async (email) => {
  try {
    const query = `SELECT * FROM Player WHERE email = $1`;
    const result = await db.query(query, [email]);
    return result;
  } catch (error) {
    throw error;
  }
};

const selectPlayerByname = async (name) => {
  try {
    const query = `SELECT * FROM Player WHERE username = $1`;
    const result = await db.query(query, [name]);
    return result;
  } catch (error) {
    throw error;
  }
};

const selectAllPlayers = async () => {
  try {
    const query = `SELECT * FROM Player`;
    const result = await db.query(query);
    return result;
  } catch (error) {
    throw error;
  }
};

const verificarCredenciales = async (email, password) => {
  const query = 'SELECT * FROM Player WHERE email = $1 AND password = $2';
  const values = [email, password];
  try {
    const res = await db.query(query, values);
    return res.rowCount == 1; // Returns true if there is one row that meets the conditions
  } catch (err) {
    console.error('Error verifying user credentials:', err);
    throw err;
  }
};

module.exports = {
  insertPlayer,
  updatePlayer,
  deletePlayer,
  selectPlayer,
  selectAllPlayers,
  verificarCredenciales,
  selectPlayerByname,
};
