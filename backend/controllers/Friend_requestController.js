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
      const query = `DELETE FROM friend WHERE player_from = $1 AND player_to = $2 OR player_from = $2 AND player_to = $1`;
      const result = await db.query(query, [player_from, player_to]);
      return result;
    } catch (error) {
      throw error;
    }
};

//Selects friends requests pending to be confirmed by us
const selectFriends_Requests = async (player_email) => {
    try {
      const query = `SELECT player_from AS friend_email, username, picture FROM friend 
                      INNER JOIN Player ON friend.player_from = Player.email
                      WHERE Player_to = $1`;

      const values = [player_email, player_email];
      const result = await pool.query(query, values);
      return result;
    } catch (error) {
      throw error;
    }
};

//Select friends request to be confirmed by the other
const selectFriends_Requests_Made = async (player_email) => {
    try {
      const query = `SELECT player_to AS friend_email, username, picture FROM friend 
                      INNER JOIN Player ON friend.player_to = Player.email
                      WHERE Player_from = $1`;

      const values = [player_email, player_email];
      const result = await db.query(query, values);
      return result;
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
}