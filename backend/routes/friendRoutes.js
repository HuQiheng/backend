const express = require('express');
const router = express.Router();
require('dotenv').config();
const checkAuthenticated = require('../middleware/authGoogle');
const friendsController = require('../controllers/FriendController');
const friendReqController = require('../controllers/FriendReqController');
const ObtainsController = require('../controllers/ObtainsController');
const { giveAchievement } = require('../middleware/game')

/**
 * @description This function handles the GET request to retrieve all friends of a specific user.
 * @param {string} email The email of the user whose friends are to be retrieved.
 * @returns {Object} The result of running the friends retrieval query.
 */
router.get('/:email/friends', checkAuthenticated, async (req, res) => {
  try {
    if (req.user.email === req.params.email) {
      const userInfo = await friendsController.selectFriends(req.params.email);
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
 * @description This function handles the PUT request to add a friend for a specific user.
 * @param {string} email The email of the user who is adding a friend.
 * @returns {Object} The result of running the friend addition query.
 */
router.put('/:email/friends', checkAuthenticated, async (req, res) => {
  const friendEmail = req.body.email;
  try {
    if (req.user.email === req.params.email) {
      const areAlreadyFriends = await friendsController.areFriends(req.params.email, friendEmail);
      if (areAlreadyFriends) {
        res.status(400).send({ message: 'Users are already friends' });
      } else {
        // Verificamos si este usuario ha enviado una solicitud de amistad a req.body.friend
        const friendReq = await friendReqController.selectFriendReq(req.params.email);
        let isSent = false;
        for (let i = 0; i < friendReq.rows.length; i++) {
          if (friendReq.rows[i].email === friendEmail) {
            isSent = true;
            break;
          }
        }
        if (!isSent) {
          res.status(400).send({ message: 'Friend request not sent' });
        } else {
          // We add the logic to insert a friend
          await friendsController.insertFriend(req.params.email, friendEmail);
          // Check achievement 
          await giveAchievement(null,'Tu primer compañero', req.params.email);
          await giveAchievement(null,'Tu primer compañero', req.body.email);

          await friendReqController.removeFriendReq(req.params.email, friendEmail);
          res.json({ message: 'Friend added' });
        }
      }
    } else {
      res.status(403).send({ message:'Access denied' });
    }
  } catch (error) {
    console.error('Error adding friend', error);
    res.status(500).send({ message: 'Internal Server Error: ' + error.message });
  }
});

/**
 * @description This function handles the DELETE request to remove a friend for a specific user.
 * @param {string} email The email of the user who is removing a friend.
 * @returns {Object} The result of running the friend removal query.
 */
router.delete('/:email/friends', checkAuthenticated, async (req, res) => {
  try {
    if (req.user.email === req.params.email) {
      await friendsController.removeFriend(req.params.email, req.body.email);
      res.json({ message: 'Friend deleted' });
    } else {
      res.status(403).send({ message: 'Access denied' });
    }
  } catch (error) {
    console.error('Error deleting friend', error);
    res.status(500).send({ message: 'Internal Server Error: ' + error.message });
  }
});

/**
 * @description This function handles the GET request to check if two users are friends.
 * @param {string} email1 The email of the first user.
 * @param {string} email2 The email of the second user.
 * @returns {Object} The result of running the friendship check query.
 */
router.get('/:email1/:email2/friendship', checkAuthenticated, async (req, res) => {
  try {
    if (req.user.email === req.params.email1 || req.user.email === req.params.email2){
      const user1 = req.params.email1;
      const user2 = req.params.email2;
      const areFriends = await friendsController.areFriends(user1, user2);
      res.json({ areFriends: areFriends });
    } else {
      res.status(403).send({ message: 'Access denied' });
    }
  } catch (error) {
    console.error('Error checking friendship status', error);
    res.status(500).send({ message: 'Internal Server Error: ' + error.message });
  }
});

module.exports = router;
