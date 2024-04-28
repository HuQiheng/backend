const db = require('../db/index');

//Insert a new friend request
const insertFriend_Request = async (player_from, player_to) => {
    try {
      const query = `INSERT INTO friend_request (Player_from, Player_to) VALUES($1, $2)`;
      const values = [player_from, player_to];
      const result = await db.query(query, values);
      return result;
    } catch (error) {
      throw error;
    }
};

//Select all the list of friends requests
const selectAllFriends_requests = async () => {
    try {
      const query = `SELECT * FROM friend_request`;
      const result = await db.query(query);
      return result;
    } catch (error) {
      throw error;
    }
};


//Deletes a friend request that was made
const removeFriend_Request = async (player_from, player_to) => {
    try {
      const query = `DELETE FROM Friend_request WHERE player_from = $1 AND player_to = $2 OR player_from = $2 AND player_to = $1`;
      const result = await db.query(query, [player_from, player_to]);
      return result;
    } catch (error) {
      throw error;
    }
};

//Selects friends requests pending to be confirmed by us
const selectFriends_Requests = async (player_email) => {
    try {
      const query = `SELECT P.email, P.username, P.picture
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

//Select friends request to be confirmed by the other
const selectFriends_Requests_Made = async (player_email) => {
    try {
      const query = `SELECT P.email, P.username, P.picture
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
    insertFriend_Request,
    selectAllFriends_requests,
    removeFriend_Request,
    selectFriends_Requests,
    selectFriends_Requests_Made,
    friendRequestExist,
}