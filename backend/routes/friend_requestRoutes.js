const express = require('express');
const router = express.Router();
require('dotenv').config();
const checkAuthenticated = require('../middleware/authGoogle');
const friendsController = require('../controllers/FriendController');
const friendsReqController = require('../controllers/FriendReqController');

/**
 * @description This function handles the GET request to retrieve friend requests for a specific user.
 * It checks if the authenticated user is the same as the user specified in the route parameter.
 * If the users match, it retrieves the friend requests for that user.
 * If the users do not match, it sends a 403 Forbidden response.
 * @param {string} email The email of the user whose friend requests are to be retrieved.
 * @returns {Object} The result of running the friend request retrieval query.
 * If the retrieval is successful, an array of friend requests is returned.
 * In case of an error, an error message is returned with a status code of 500.
 */
router.get('/:email/friendsRequests', checkAuthenticated, async (req, res) => {
    try {
      if (req.user.email === req.params.email) {
        const userInfo = await friendsReqController.selectFriendReq(req.params.email);
        res.send(userInfo.rows);
      } else {
        res.status(403).send({ message: 'Access denied' });
      }
    } catch (error) {
      console.error('Error getting friends information', error);
      res.status(500).send({ message: 'Internal Server Error: ' + error.message });
    }
});

/**
 * @description This function handles the GET request to retrieve the friend requests made by a specific user.
 * It checks if the authenticated user is the same as the user specified in the route parameter.
 * If the users match, it retrieves the friend requests made by that user.
 * If the users do not match, it sends a 403 Forbidden response.
 * @param {string} email The email of the user whose made friend requests are to be retrieved.
 * @returns {Object} The result of running the friend request retrieval query.
 * If the retrieval is successful, an array of made friend requests is returned.
 * In case of an error, an error message is returned with a status code of 500.
 */
router.get('/:email/myFriendsRequests', checkAuthenticated, async (req, res) => {
    try {
      if (req.user.email === req.params.email) {
        const userInfo = await friendsReqController.selectFriendReqMade(req.params.email);
        res.send(userInfo.rows);
      } else {
        res.status(403).send({ message: 'Access denied' });
      }
    } catch (error) {
      console.error('Error getting friends information', error);
      res.status(500).send({ message: 'Internal Server Error: ' + error.message });
    }
});

/**
 * @description This function handles the PUT request to add a friend request for a specific user.
 * It checks if the users are already friends or if a friend request has already been sent.
 * If neither condition is met, it adds a friend request.
 * @param {string} email The email of the user who is making the friend request.
 * @returns {Object} The result of running the friend request addition query.
 * If the addition is successful, a success message is returned.
 * If the users are already friends or a friend request has already been sent, an error message is returned with a status code of 400.
 * In case of an error, an error message is returned with a status code of 500.
 */
router.put('/:email/friendRequests', checkAuthenticated, async (req, res) => {
  try {
      const areAlreadyFriends = await friendsController.areFriends(req.params.email, req.body.to);
      const isRequestAlreadySent = await friendsReqController.friendRequestExist(req.body.to, req.params.email);

      if (areAlreadyFriends) {
          res.status(400).send({ message: 'Users are already friends' });
      } else if (isRequestAlreadySent) {
          res.status(400).send({ message: 'Friend request already sent' });
      } else {
          await friendsReqController.insertFriendReq(req.params.email, req.body.to);
          res.json({ message: 'Friend request sent' });
      }
  } catch (error) {
      console.error('Error adding friend', error);
      res.status(500).send({ message: 'Internal Server Error: ' + error.message });
  }
});

/**
 * @description This function handles the DELETE request to remove a friend request for a specific user.
 * It checks if the authenticated user is the same as the user specified in the route parameter.
 * If the users match, it removes the friend request.
 * If the users do not match, it sends a 403 Forbidden response.
 * @param {string} email The email of the user who is removing the friend request.
 * @returns {Object} The result of running the friend request removal query.
 * If the removal is successful, a success message is returned.
 * In case of an error, an error message is returned with a status code of 500.
 */
router.delete('/:email/friendRequests', checkAuthenticated, async (req, res) => {
    try {
      if (req.user.email === req.params.email) {
        await friendsReqController.removeFriendReq(req.params.email, req.body.to);
        res.json({ message: 'Request deleted' });
      } else {
        res.status(403).send({ message: 'Access denied' });
      }
    } catch (error) {
      console.error('Error deleting friend', error);
      res.status(500).send({ message: 'Internal Server Error: ' + error.message });
    }
});

/**
 * @description This function handles the GET request to check the existence of a friend request between two users.
 * It checks if the authenticated user is one of the two users specified in the route parameters.
 * If the authenticated user is one of the two users, it checks the existence of a friend request between the two users.
 * If the authenticated user is not one of the two users, it sends a 403 Forbidden response.
 * @param {string} email1 The email of the first user.
 * @param {string} email2 The email of the second user.
 * @returns {Object} The result of running the friend request existence check query.
 * If the check is successful, a boolean indicating the existence of a friend request is returned.
 * In case of an error, an error message is returned with a status code of 500.
 */
router.get('/:email1/:email2/friendRequest/existence', checkAuthenticated, async (req, res) => {
  try {
    if (req.user.email === req.params.email1 || req.user.email === req.params.email2){
      const user1 = req.params.email1;
      const user2 = req.params.email2;
      const hasFriendReq = await friendsReqController.friendRequestExist(user1, user2);
      res.json({ hasFriendReq: hasFriendReq });
    } else {
      res.status(403).send({ message: 'Access denied' });
    }
  } catch (error) {
    console.error('Error checking friendship status', error);
    res.status(500).send({ message: 'Internal Server Error: ' + error.message });
  }
});

module.exports = router;