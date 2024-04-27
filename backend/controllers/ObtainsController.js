const db = require('../db/index');

//A user unlocks an achievement
const insert = async (title, player_email) => {
  try {
    const query = `INSERT INTO Obtains (Achievements_title, Players_email) VALUES($1, $2)`;
    const values = [title, player_email];
    const result = await db.query(query, values);
    return result;
  } catch (error) {
    throw error;
  }
}

const selectAll = async () =>  {
  try {
    const query = `SELECT * FROM Obtains`;
    const result = await db.query(query);
    return result;
  } catch (error) {
    throw error;
  }
}

//Remove that a user has an achievement
const removeById = async (Achievements_title, Players_email) => {
  try {
    const query = `DELETE FROM Obtains WHERE Achievements_title = $1 AND Players_email = $2`;
    const result = await db.query(query, [Achievements_title, Players_email]);
    return result;
  } catch (error) {
    throw error;
  }
}

//All the achievements of a user
const achievementsOfUser = async (player_email) => {
  try {
    const query = `SELECT * FROM Obtains WHERE players_email = $1`;
    const result = await db.query(query, [player_email]);
    return result;
  } catch (error) {
    throw error;
  }
}

//True if user has the achievement false in any ohter case
const hasAchievement = async (achievements_title, players_email) => {
  try{
    const query = `SELECT * FROM Obtains WHERE achievements_title = $1 AND players_email = $2`;
    const values = [achievements_title, players_email];
    const result = await db.query(query, values);
    return result.rows.length > 0;
  } catch (error){
    throw error;
  }
  
}

module.exports = {
  insert,
  selectAll,
  removeById,
  achievementsOfUser,
  hasAchievement,
};
