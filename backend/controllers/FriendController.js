/**Controller to for all the friends*/
const db = require('../db/index');

/**
 * @description create a new friendship relation between the
 * two users
 * @param {string} player_email1
 * @param {string} player_email2
 * @returns The result of running the query
 */
const insertFriend = async (player_email1, player_email2) => {
  try {
    const query = `INSERT INTO Friend (Player_email1, Player_email2) VALUES($1, $2)`;
    const values = [player_email1, player_email2];
    const result = await db.query(query, values);
    return result;
  } catch (error) {
    throw error;
  }
};

/**
 *
 * @returns all the friendship relations
 */
const selectAllFriends = async () => {
  try {
    const query = `SELECT * FROM Friend`;
    const result = await db.query(query);
    return result;
  } catch (error) {
    throw error;
  }
};

/**
 * @description Function to delete the friendship relation between the users
 * @param {String} player_email1
 * @param {String} player_email2
 * @returns The result of deleting the friendship relation between the users
 */
const removeFriend = async (player_email1, player_email2) => {
  try {
    const query = `DELETE FROM Friend WHERE Player_email1 = $1 AND Player_email2 = $2 OR Player_email1 = $2 AND Player_email2 = $1`;
    const values = [player_email1, player_email2];
    const result = await db.query(query, values);
    return result;
  } catch (error) {
    throw error;
  }
};

/**
 *
 * @param {string} player_email
 * @returns All the friends of player_email
 */
const selectFriends = async (player_email) => {
  try {
    const query = `SELECT Player_email2 AS email, username AS name, picture FROM Friend 
                    INNER JOIN Player ON Friend.Player_email2 = Player.email
                    WHERE Player_email1 = $1
                  UNION
                    SELECT Player_email1 AS email, username AS name, picture FROM Friend 
                    INNER JOIN Player ON Friend.Player_email1 = Player.email
                    WHERE Player_email2 = $1`;
    const values = [player_email];
    const result = await db.query(query, values);
    return result;
  } catch (error) {
    throw error;
  }
};

/**
 * @description given two emails return if they are friends or not
 * @param {string} player_email1
 * @param {string} player_email2
 * @returns True only if the two users are friends
 */
const areFriends = async (player_email1, player_email2) => {
  try {
    const query = `SELECT * FROM Friend WHERE Player_email1 = $1 AND Player_email2 = $2 OR Player_email1 = $2 AND Player_email2 = $1`;
    const values = [player_email1, player_email2];
    const result = await db.query(query, values);
    return result.rows.length > 0;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  insertFriend,
  selectAllFriends,
  removeFriend,
  selectFriends,
  areFriends,
};
