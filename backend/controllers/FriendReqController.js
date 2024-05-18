/**Controller for all the friend requests*/
const db = require('../db/index');

//Insert a new friend request
/**
 * @description create a friend request from the user
 * player_from to the player_to
 * @param {string} player_from
 * @param {string} player_to
 * @returns the result of running the query
 */
const insertFriendReq = async (player_from, player_to) => {
  try {
    const query = `INSERT INTO friend_request (Player_from, Player_to) VALUES($1, $2)`;
    const values = [player_from, player_to];
    const result = await db.query(query, values);
    return result;
  } catch (error) {
    throw error;
  }
};

/**
 *
 * @returns All the list of friends requests
 */
const selectAllFriendsReq = async () => {
  try {
    const query = `SELECT * FROM friend_request`;
    const result = await db.query(query);
    return result;
  } catch (error) {
    throw error;
  }
};

/**
 * @description Delete a friend request that was made
 * @param {string} player_from
 * @param {string} player_to
 * @returns The result of running the query
 */
const removeFriendReq = async (player_from, player_to) => {
  try {
    const query = `DELETE FROM Friend_request WHERE player_from = $1 AND player_to = $2 OR player_from = $2 AND player_to = $1`;
    const result = await db.query(query, [player_from, player_to]);
    return result;
  } catch (error) {
    throw error;
  }
};

//Selects friends requests pending to be confirmed by us
/**
 * @description Selects all the friend request that users made
 * to player_email
 * @param {string} player_email
 * @returns The result of running the query
 */
const selectFriendReq = async (player_email) => {
  try {
    const query = `SELECT P.email, P.username as name, P.picture
                      FROM Friend_request F
                      JOIN Player P ON F.Player_from = P.email
                      WHERE F.Player_to = $1;`;

    const values = [player_email];
    const result = await db.query(query, values);
    return result;
  } catch (error) {
    throw error;
  }
};

/**
 * @description Selects all the friend request that player_email
 * made
 * @param {string} player_email
 * @returns The result of running the query
 */
const selectFriendReqMade = async (player_email) => {
  try {
    const query = `SELECT P.email, P.username as name, P.picture
                      FROM Friend_request F
                      JOIN Player P ON F.Player_to = P.email
                      WHERE F.Player_from = $1;`;

    const values = [player_email];
    const result = await db.query(query, values);
    return result;
  } catch (error) {
    throw error;
  }
};

/**
 * @description Check if there is a friend request between two users
 * @param {string} player_email1
 * @param {string} player_email2
 * @returns True only if there is a friend request between two users
 */
const friendRequestExist = async (player_email1, player_email2) => {
  try {
    const query = `SELECT * FROM Friend_request WHERE Player_from = $1 AND Player_to = $2 OR Player_from = $2 AND Player_to = $1`;
    const values = [player_email1, player_email2];
    const result = await db.query(query, values);
    return result.rows.length > 0;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  insertFriendReq,
  selectAllFriendsReq,
  removeFriendReq,
  selectFriendReq,
  selectFriendReqMade,
  friendRequestExist,
};
