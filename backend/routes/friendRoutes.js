const express = require('express');
const router = express.Router();
require('dotenv').config();
const checkAuthenticated = require('../middleware/authGoogle');
const friendsController = require('../controllers/FriendController');
const friendReqController = require('../controllers/FriendReqController');
const AchievementController = require('../controllers/AchievementController');

// Get the information of all the friends of a user
router.get('/:email/friends', checkAuthenticated, async (req, res) => {
  try {
    console.log("Solicitado " + req.params.email);
    console.log("Pedido con " + req.user.email);
    if (req.user.email === req.params.email) {
      const userInfo = await friendsController.selectFriends(req.params.email);
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
  console.log('Friend to add: ' + req.body.email);
  const friendEmail = req.body.email;
  try {
    if (req.user.email === req.params.email) {
      const areAlreadyFriends = await friendsController.areFriends(req.params.email, friendEmail);
      if (areAlreadyFriends) {
        res.status(400).send('Users are already friends');
      } else {
        //We check if this user sent a friend request to the req.body.friend
        const friendReq = await friendReqController.selectFriendReq(req.params.email);
        let isSent = false;
        for (let i = 0; i < friendReq.rows.length; i++) {
          if (friendReq.rows[i].email === friendEmail) {
            isSent = true;
          }
        }
        if (!isSent) {
          res.status(400).send('Friend request not sent');
        } else {
          await friendsController.insertFriend(req.params.email, friendEmail);
          // Check achievement 
          const achievementTitle = 'First Friend';
          const achievementUnlocked = await AchievementController.hasAchievement(achievementTitle, req.user.email);
          if (!achievementUnlocked) {
            await AchievementController.unlockAchievement(achievementTitle, req.user.email);
          }
          // sendingThroughEmail(emailToSocket, user.email, 'achievementUnlocked', achievementTitle); 
          // Cómo deberíamos notificarlo?

          await friendReqController.removeFriendReq(req.params.email, friendEmail);
          res.json({ message: 'Friend added' });
        }
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
  console.log('Friend to delete: ' + req.body.email);
  try {
    if (req.user.email === req.params.email) {
      await friendsController.removeFriend(req.params.email, req.body.email);
      res.json({ message: 'Friend deleted' });
    } else {
      res.status(403).send('Access denied');
    }
  } catch (error) {
    console.error('Error deleting friend', error);
    res.status(500).send('Internal Server Error: ' + error.message);
  }
});

router.get('/:email1/:email2/friendship', checkAuthenticated, async (req, res) => {
  try {
    if (req.user.email === req.params.email1 || req.user.email === req.params.email2){
      const user1 = req.params.email1;
      const user2 = req.params.email2;
      const areFriends = await friendsController.areFriends(user1, user2);
      res.json({ areFriends: areFriends });
    } else {
      res.status(403).send('Access denied');
    }
  } catch (error) {
    console.error('Error checking friendship status', error);
    res.status(500).send('Internal Server Error: ' + error.message);
  }
});

module.exports = router;
