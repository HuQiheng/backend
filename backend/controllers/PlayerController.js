const db = require('../db/index.js');

const insertPlayer = async (email, username, password, picture) => {
  try {
    const query = `INSERT INTO Player (email, username, password, picture, victories) VALUES ($1, $2, $3, $4, $5)`;
    const values = [email, username, password, picture, 0];
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

const updatePlayerPicture = async (email, picture) => {
  try {
    const query = `UPDATE Player SET picture = $2 WHERE email = $1 RETURNING *`;
    const values = [email, picture];
    const result = await db.query(query, values);
    return result;
  } catch (error) {
    throw error;
  }
}

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

const getWins = async (email) => {
  try {
    const query = `SELECT victories FROM Player WHERE email = $1`;
    const result = await db.query(query, [email]);
    return result.rows[0].victories;
  } catch (error) {
    throw error;
  }
};

const updateWins = async (email) => {
  try {
    const query = `UPDATE Player SET victories = victories + 1 WHERE email = $1`;
    const result = await db.query(query, [email]);
    return result.rows[0];
  } catch (error) {
    throw error;
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
  getWins,
  updateWins,
  updatePlayerPicture
};
