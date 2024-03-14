const db = require('../db/index');

const insertFriend = async (player_email1, player_email2) => {
  try {
    const query = `INSERT INTO friend (Player_email1, Player_email2) VALUES(?, ?)`;
    const values = [player_email1, player_email2];
    const result = await db.query(query, values);
    return result;
  } catch (error) {
    throw error;
  }
};

const selectAllFriends = async () => {
  try {
    const query = `SELECT * FROM friend`;
    const result = await db.query(query);
    return result;
  } catch (error) {
    throw error;
  }
};

const removeFriend = async (player_email2) => {
  try {
    const query = `DELETE FROM friend WHERE Player_email2 = ?`;
    const result = await db.query(query, [player_email2]);
    return result;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  insertFriend,
  selectAllFriends,
  removeFriend,
};
