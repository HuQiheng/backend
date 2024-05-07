/**Controller for all the achievements**/
const db = require('../db/index');

/**
 * @description Create a new achievement with the given title and description
 * @param {string} title 
 * @param {string} description 
 * @returns The result of running the query
 */
const insertAchievement = async (title, description) => {
  try {
    const query = `INSERT INTO Achievement (title, description) VALUES($1, $2)`;
    const result = await db.query(query, [title, description]);
    return result;
  } catch (error) {
    throw error;
  }
};
/**
 * @description Select an achievement based on the given title
 * @param {string} title 
 * @returns 
 */
const selectAchievement = async(title) => {
  try {
    const query = `SELECT * FROM Achievement WHERE title = $1`;
    const result = await db.query(query, [title]);
    return result;
  } catch (error) {
    throw error;
  }
};

/**
 * 
 * @returns All the achievements in the table
 */
const selectAllAchievements = async () => {
  try {
    const query = `SELECT * FROM Achievement`;
    const result = await db.query(query);
    return result;
  } catch (error) {
    throw error;
  }
};


/**
 * @description Remove the achievement identified by title
 * @param {string} title 
 * @returns The result of running the query
 */
const removeAchievement = async (title) => {
  try {
    const query = `DELETE FROM Achievement WHERE title = $1`;
    const result = await db.query(query, [title]);
    return result;
  } catch (error) {
    throw error;
  }
};


/**
 * @description Update the achievement identified by title, changing
 * the description
 * @param {string} title 
 * @param {string} description 
 * @returns The result of running the query
 */
const updateAchievement = async (title, description) => {
  try {
    const query = `UPDATE Achievement SET description = $1 WHERE title = $2`;
    const result = await db.query(query, [description, title]);
    if (!result || result.rowCount === 0) { 
      throw new Error('The achievement could not be updated');
    } else {
      return result.rows[0];
    }
  } catch (error) {
    throw error;
  }
};

module.exports = {
  insertAchievement,
  selectAllAchievements,
  removeAchievement,
  updateAchievement,
  selectAchievement,
};
