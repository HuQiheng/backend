const express = require('express');
const router = express.Router(); // Create a new router
require('dotenv').config();
const checkAuthenticated = require('../middleware/authGoogle');
const playerController = require('../controllers/PlayerController');
const friendController = require('../controllers/FriendController');
const obtainsController = require('../controllers/ObtainsController');

/**
 * @description This function handles the GET request to retrieve a specific user's information.
 * It checks if the authenticated user is the same as the user specified in the route parameter or if they are friends.
 * If either condition is met, it retrieves the user's information.
 * If neither condition is met, it sends a 500 Internal Server Error response.
 * @param {string} email The email of the user whose information is to be retrieved.
 * @returns {Object} The result of running the user information retrieval query.
 * If the retrieval is successful, the user's information is returned.
 * In case of an error, an error message is returned with a status code of 500.
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
 * It checks if the authenticated user is the same as the user specified in the route parameter.
 * If the users match, it updates the user's information.
 * If the users do not match, it sends a 500 Internal Server Error response.
 * @param {string} email The email of the user whose information is to be updated.
 * @returns {Object} The result of running the user information update query.
 * If the update is successful, a success message is returned.
 * In case of an error, an error message is returned with a status code of 500.
 */
router.put('/:email', checkAuthenticated, async (req, res) => {
  try {
    console.log('Info: \n');
    console.log('Email: ' + req.params.email + '\n');
    console.log('Password: ' + req.body.password);
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
 * It checks if the authenticated user is the same as the user specified in the route parameter.
 * If the users match, it deletes the user.
 * If the users do not match, it sends a 500 Internal Server Error response.
 * @param {string} email The email of the user to be deleted.
 * @returns {Object} The result of running the user deletion query.
 * If the deletion is successful, a success message is returned.
 * In case of an error, an error message is returned with a status code of 500.
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
 * It checks if the authenticated user is the same as the user specified in the route parameter or if they are friends.
 * If either condition is met, it retrieves the user's achievements.
 * If neither condition is met, it sends a 500 Internal Server Error response.
 * @param {string} email The email of the user whose achievements are to be retrieved.
 * @returns {Object} The result of running the achievements retrieval query.
 * If the retrieval is successful, the user's achievements are returned.
 * In case of an error, an error message is returned with a status code of 500.
 */
router.get('/:email/achievements', checkAuthenticated, async (req, res) => {
  try {
    console.log('Email pedido ' + req.params.email);
    console.log('Especificado ' + req.user.email);
    if (req.user.email === req.params.email || friendController.areFriends(req.user.email, req.params.email)) {
      const userAchievements = await obtainsController.achievementsOfUser(req.params.email);
      res.send(userAchievements.rows);
    }
  } catch (error) {
    console.error('Error getting user achievements', error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
});

module.exports = router; // Export the router
