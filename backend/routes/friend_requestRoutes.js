const express = require('express');
const router = express.Router();
require('dotenv').config();
const checkAuthenticated = require('../middleware/authGoogle');
const friendsController = require('../controllers/FriendController');
const friendsReqController = require('../controllers/FriendReqController');

/**
 * @description This function handles the GET request to retrieve friend requests for a specific user.
 * @param {string} email The email of the user whose friend requests are to be retrieved.
 * @returns {Object} The result of running the friend request retrieval query.
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
 * @param {string} email The email of the user whose made friend requests are to be retrieved.
 * @returns {Object} The result of running the friend request retrieval query.
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
 * @param {string} email The email of the user who is making the friend request.
 * @returns {Object} The result of running the friend request addition query.
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
 * @description This function handles the DELETE request to remove a friend request for a specific user..
 * @param {string} email The email of the user who is removing the friend request.
 * @returns {Object} The result of running the friend request removal query.
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
 * @param {string} email1 The email of the first user.
 * @param {string} email2 The email of the second user.
 * @returns {Object} The result of running the friend request existence check query..
 */
router.get('/:email1/:email2/friendRequest/existence', checkAuthenticated, async (req, res) => {
  try {
    if (req.user.email === req.params.email1 || req.user.email === req.params.email2) {
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
