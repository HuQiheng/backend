/**Controller for all the players**/
const db = require('../db/index.js');

/**
 * @description Creates a new player
 * @param {string} email
 * @param {string} username
 * @param {string} password
 * @param {string} picture
 * @returns The result of running the query
 */
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

/**
 * @description Update the information of the user identified by email
 * @param {string} email
 * @param {string} username
 * @param {string} password
 * @param {string} picture
 * @returns The result of running the query
 */
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
/**
 * @description updates the player picture
 * @param {string} email
 * @param {string} picture
 * @returns The result of running the query
 */
const updatePlayerPicture = async (email, picture) => {
  try {
    const query = `UPDATE Player SET picture = $2 WHERE email = $1 RETURNING *`;
    const values = [email, picture];
    const result = await db.query(query, values);
    return result;
  } catch (error) {
    throw error;
  }
};

/**
 * @description Deletes all the user information
 * @param {string} email
 * @returns The result of running the query
 */
const deletePlayer = async (email) => {
  try {
    const query = `DELETE FROM Player WHERE email = $1`;
    const result = await db.query(query, [email]);
    return result;
  } catch (error) {
    throw error;
  }
};

/**
 * @description List all the user information
 * @param {string} email
 * @returns The result of running the query
 */
const selectPlayer = async (email) => {
  try {
    const query = `SELECT * FROM Player WHERE email = $1`;
    const result = await db.query(query, [email]);
    return result;
  } catch (error) {
    throw error;
  }
};

/**
 * @description List all the user information by the given name
 * it can return more than one user
 * @param {string} name
 * @returns The result of running the query
 */
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
    return res.rowCount == 1;
  } catch (err) {
    console.error('Error verifying user credentials:', err);
    throw err;
  }
};

/**
 * @description Check the number of wins that a user has
 * @param {string} email
 * @returns The result of running the query
 */
const getWins = async (email) => {
  try {
    const query = `SELECT victories FROM Player WHERE email = $1`;
    const result = await db.query(query, [email]);
    return result.rows[0].victories;
  } catch (error) {
    throw error;
  }
};

/**
 * @description Add one to the number of victories that a user has
 * @param {string} email
 * @returns The result of running the query
 */
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
  updatePlayerPicture,
};
