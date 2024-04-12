const express = require('express');
const router = express.Router(); // Create a new router
require('dotenv').config();
const checkAuthenticated = require('../middleware/authGoogle');
const playerController = require('../controllers/PlayerController');
const friendsController = require('../controllers/FriendsController');

//Method that gets the users friends info
router.get('/get/:email/friends', checkAuthenticated, async (req, res) => {
  try {
    if (req.user.email === req.params.email) {
      // returns the emails, name and picture of the friends
      const userInfo = await friendsController.selectAllFriends(req.params.email);
      res.send(userInfo.rows);
    }
  } catch (error) {
    console.error('Error getting friends info', error);
    res.status(500).send('Internal Server Error');
  }
});
  
//Method that adds a friend to the user friends list, the mail is required in the body of the json
router.post('/add/:email/friends', checkAuthenticated, async (req, res) => {
  console.log('Email pedido ' + req.params.email);
  console.log('Amigo a añadir: ' + req.body.friend);
  try {
    if (req.user.email === req.params.email) {
      await playerController.insertFriend(req.params.email);
      res.send('Friend added');
    }
  } catch (error) {
    console.error('Error adding friend', error);
    res.status(500).send('Internal Server Error');
  }
});



//Method that deletes a friend from the user friends list, the mail is required in the body of the json
router.delete('/delete/:email/friends', checkAuthenticated, async (req, res) => {
  console.log('Email pedido ' + req.params.email);
  console.log('Amigo a eliminar: ' + req.body.friend);
  try {
    if (req.user.email === req.params.email) {
      await playerController.removeFriend(req.params.email);
      res.send('User deleted');
    }
  } catch (error) {
    console.error('Error deleting friend', error);
    res.status(500).send('Internal Server Error');
  }
});
  

module.exports = router; // Export the router  