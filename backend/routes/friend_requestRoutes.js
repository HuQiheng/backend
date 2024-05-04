const express = require('express');
const router = express.Router();
require('dotenv').config();
const checkAuthenticated = require('../middleware/authGoogle');
const friendsController = require('../controllers/FriendController');
const friendsReqController = require('../controllers/FriendReqController');

// Get the information of all the peding requests to the user
router.get('/:email/friendsRequests', checkAuthenticated, async (req, res) => {
    try {
      console.log("Solicitado " + req.params.email);
      console.log("Pedido con " + req.user.email);
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

// Get the information of all the peding requests made by the user
router.get('/:email/myFriendsRequests', checkAuthenticated, async (req, res) => {
    try {
      console.log("Solicitado " + req.params.email);
      console.log("Pedido con " + req.user.email);
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

// Add a friend to the user's pending list
router.put('/:email/friendRequests', checkAuthenticated, async (req, res) => {
  console.log('Requested email ' + req.params.email);
  console.log('Friend to add: ' + req.body.to);
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

// Delete a friend request  made or received
router.delete('/:email/friendRequests', checkAuthenticated, async (req, res) => {
    console.log('Requested email ' + req.params.email);
    console.log('Friend to delete: ' + req.body.to);
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