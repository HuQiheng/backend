const db = require('../db/index');

const insertAchievement = async (title, description) => {
  try {
    const query = `INSERT INTO Achievement (title, description) VALUES($1, $2)`;
    const result = await db.query(query, [title, description]);
    return result;
  } catch (error) {
    throw error;
  }
};

const selectAllAchievements = async () => {
  try {
    const query = `SELECT * FROM Achievement`;
    const result = await db.query(query);
    return result;
  } catch (error) {
    throw error;
  }
};

const removeAchievement = async (title) => {
  try {
    const query = `DELETE FROM Achievement WHERE title = $1`;
    const result = await db.query(query, [title]);
    return result;
  } catch (error) {
    throw error;
  }
};

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
};
