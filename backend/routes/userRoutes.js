const express = require('express');
const router = express.Router(); // Create a new router
require('dotenv').config();
const checkAuthenticated = require('../middleware/authGoogle');
const playerController = require('../controllers/PlayerController');
const friendController = require('../controllers/FriendController');
const obtainsController = require('../controllers/ObtainsController');

/**
 * @description This function handles the GET request to retrieve a specific user's information.
 * @param {string} email The email of the user whose information is to be retrieved.
 * @returns {Object} The result of running the user information retrieval query.
 */
router.get('/:email', checkAuthenticated, async (req, res) => {
  try {
    if (req.user.email === req.params.email || friendController.areFriends(req.user.email, req.params.email)) {
      const userInfo = await playerController.selectPlayer(req.params.email);
      res.send(userInfo.rows[0]);
    }
  } catch (error) {
    console.error('Error getting user info', error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
});

/**
 * @description This function handles the PUT request to update a specific user's information.
 * @param {string} email The email of the user whose information is to be updated.
 * @returns {Object} The result of running the user information update query.
 */
router.put('/:email', checkAuthenticated, async (req, res) => {
  try {
    if (req.user.email === req.params.email) {
      const userInfo = await playerController.updatePlayer(req.params.email, req.body.username, req.body.password, req.body.picture);
      res.send('User updated ' + userInfo.rows[0].email.trim());
    }
  } catch (error) {
    console.error('Error updating user info', error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
});

/**
 * @description This function handles the DELETE request to delete a specific user.
 * @param {string} email The email of the user to be deleted.
 * @returns {Object} The result of running the user deletion query.
 */
router.delete('/:email', checkAuthenticated, async (req, res) => {
  try {
    if (req.user.email === req.params.email) {
      await playerController.deletePlayer(req.params.email);
      res.send('User deleted');
    }
  } catch (error) {
    console.error('Error deleting user', error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
});

/**
 * @description This function handles the GET request to retrieve a specific user's achievements.
 * @param {string} email The email of the user whose achievements are to be retrieved.
 * @returns {Object} The result of running the achievements retrieval query.
 */
router.get('/:email/achievements', checkAuthenticated, async (req, res) => {
  try {
    if (req.user.email === req.params.email || friendController.areFriends(req.user.email, req.params.email)) {
      const userAchievements = await obtainsController.achievementsOfUser(req.params.email);
      res.send(userAchievements.rows);
    }
  } catch (error) {
    console.error('Error getting user achievements', error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
});

/**
 * @description This function handles the PUT request to select a specific user's achievements.
 * @param {string} email The email of the user whose achievements are to be selected.
 * @returns {Object} The result of running the achievements selection query.
 */
router.put('/:email/achievements', checkAuthenticated, async (req, res) => {
  try {
    if (req.user.email === req.params.email) {
      const userAchievements = await obtainsController.selectAchievements(req.params.email, req.body.achievements);
      res.send(userAchievements.rows);
    }
  } catch (error) {
    console.error('Error selecting user achievements', error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
});

/**
 * @description This function handles the GET request to get the number of wins of a player
 * @param {string} email The email of the user
 * @returns {Integer} The number of wins of the player
 */
router.get('/:email/wins', checkAuthenticated, async (req, res) => {
  try {
    if (req.user.email === req.params.email || friendController.areFriends(req.user.email, req.params.email)) {
      const userWins = await playerController.getWins(req.params.email);
      res.send(userWins.rows[0]);
    }
  } catch (error) {
    console.error('Error getting user wins', error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
});

module.exports = router; // Export the router
