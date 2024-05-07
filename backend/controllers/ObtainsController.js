/**Controller for all the achievement unlocks*/
const db = require('../db/index');

/**
 * @description The user unlocks the achievement
 * @param {string} title 
 * @param {string} player_email 
 * @returns The result of running the query
 */
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

/**
 * 
 * @returns All the users and the achievement that they unlocked
 */
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
/**
 * @description Remove the fact that a user has an achievement
 * @param {string} Achievements_title 
 * @param {string} Players_email 
 * @returns The result of running the query
 */
const removeById = async (Achievements_title, Players_email) => {
  try {
    const query = `DELETE FROM Obtains WHERE Achievements_title = $1 AND Players_email = $2`;
    const result = await db.query(query, [Achievements_title, Players_email]);
    return result;
  } catch (error) {
    throw error;
  }
}


/**
 * @description Check all the achievements that a user has
 * @param {string} player_email 
 * @returns The result of running the query
 */
const achievementsOfUser = async (player_email) => {
  try {
    const query = `SELECT *  FROM achievement where title IN 
    (SELECT achievements_title as achievement FROM Obtains WHERE players_email = $1)`;
    const result = await db.query(query, [player_email]);
    return result;
  } catch (error) {
    throw error;
  }
}


/**
 * @description Check if the user has the achievement
 * @param {string} achievements_title 
 * @param {string} players_email 
 * @returns True only if the user has the achievement
 */
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
