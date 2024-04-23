const express = require('express');
const router = express.Router();
require('dotenv').config();
const checkAuthenticated = require('../middleware/authGoogle');
const friendsController = require('../controllers/FriendController');
const friends_reqController = require('../controllers/Friend_requestController');

// Get the information of all the peding requests to the user
router.get('/:email/friendRequests', checkAuthenticated, async (req, res) => {
    try {
      console.log("Solicitado " + req.params.email);
      console.log("Pedido con " + req.user.email);
      if (req.user.email === req.params.email) {
        const userInfo = await friends_reqController.selectFriends_Requests(req.params.email);
        res.send(userInfo.rows);
      } else {
        res.status(403).send('Access denied');
      }
    } catch (error) {
      console.error('Error getting friends information', error);
      res.status(500).send('Internal Server Error: ' + error.message);
    }
});

// Get the information of all the peding requests made by the user
router.get('/:email/myFriendRequests', checkAuthenticated, async (req, res) => {
    try {
      console.log("Solicitado " + req.params.email);
      console.log("Pedido con " + req.user.email);
      if (req.user.email === req.params.email) {
        const userInfo = await friends_reqController.selectFriends_Requests_Made(req.params.email);
        res.send(userInfo.rows);
      } else {
        res.status(403).send('Access denied');
      }
    } catch (error) {
      console.error('Error getting friends information', error);
      res.status(500).send('Internal Server Error: ' + error.message);
    }
});

// Add a friend to the user's pending list
router.put('/:email/friendRequests', checkAuthenticated, async (req, res) => {
    console.log('Requested email ' + req.params.email);
    console.log('Friend to add: ' + req.body.to);
    try {
    
        const areAlreadyFriends = await friendsController.areFriends(req.params.email, req.body.to);
        if (areAlreadyFriends) {
            res.status(400).send('Users are already friends');
        } else {
            await friends_reqController.insertFriend_Request(req.params.email, req.body.to);
            res.json({ message: 'Friend request sent' });
        }
    } catch (error) {
      console.error('Error adding friend', error);
      res.status(500).send('Internal Server Error: ' + error.message);
    }
});

// Delete a friend request  made or received
router.delete('/:email/friendRequests', checkAuthenticated, async (req, res) => {
    console.log('Requested email ' + req.params.email);
    console.log('Friend to delete: ' + req.body.to);
    try {
      if (req.user.email === req.params.email) {
        await friends_reqController.removeFriend_Request(req.params.email, req.body.to);
        res.json({ message: 'Request deleted' });
      } else {
        res.status(403).send('Access denied');
      }
    } catch (error) {
      console.error('Error deleting friend', error);
      res.status(500).send('Internal Server Error: ' + error.message);
    }
});

module.exports = router;