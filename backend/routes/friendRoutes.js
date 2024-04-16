const express = require('express');
const router = express.Router();
require('dotenv').config();
const checkAuthenticated = require('../middleware/authGoogle');
const friendsController = require('../controllers/FriendController');

// Get the information of all the friends of a user
router.get('/:email/friends', checkAuthenticated, async (req, res) => {
  try {
    console.log("Solicitado " + req.params.email);
    console.log("Pedido con " + req.user.email);
    if (req.user.email === req.params.email) {
      const userInfo = await friendsController.selectAllFriends(req.params.email);
      res.send(userInfo.rows);
    } else {
      res.status(403).send('Access denied');
    }
  } catch (error) {
    console.error('Error getting friends information', error);
    res.status(500).send('Internal Server Error: ' + error.message);
  }
});

// Add a friend to the user's friend list
router.put('/:email/friends', checkAuthenticated, async (req, res) => {
  console.log('Requested email ' + req.params.email);
  console.log('Friend to add: ' + req.body.friend);
  try {
    if (req.user.email === req.params.email) {
      const areAlreadyFriends = await friendsController.areFriends(req.params.email, req.body.friend);
      if (areAlreadyFriends) {
        res.status(400).send('Users are already friends');
      } else {
        await friendsController.insertFriend(req.params.email, req.body.friend);
        res.json({ message: 'Friend added' });
      }
    } else {
      res.status(403).send('Access denied');
    }
  } catch (error) {
    console.error('Error adding friend', error);
    res.status(500).send('Internal Server Error: ' + error.message);
  }
});

// Delete a friend from the user's friend list
router.delete('/:email/friends', checkAuthenticated, async (req, res) => {
  console.log('Requested email ' + req.params.email);
  console.log('Friend to delete: ' + req.body.friend);
  try {
    if (req.user.email === req.params.email) {
      await friendsController.removeFriend(req.params.email, req.body.friend);
      res.json({ message: 'Friend deleted' });
    } else {
      res.status(403).send('Access denied');
    }
  } catch (error) {
    console.error('Error deleting friend', error);
    res.status(500).send('Internal Server Error: ' + error.message);
  }
});

module.exports = router;
