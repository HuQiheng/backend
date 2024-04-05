const express = require('express');
const router = express.Router(); // Create a new router
require('dotenv').config();
const checkAuthenticated = require('../middleware/authGoogle');
const playerController = require('../controllers/PlayerController');

//Method that gets the users info
router.get('/get/:email', checkAuthenticated, async (req, res) => {
  try {
    console.log('Email pedido ' + req.params.email);
    console.log('Especificado ' + req.user.email);
    if (req.user.email === req.params.email) {
      const userInfo = await playerController.selectPlayer(req.params.email);
      res.send(userInfo.rows[0]);
    }
  } catch (error) {
    console.error('Error getting user info', error);
    res.status(500).send('Internal Server Error');
  }
});

//Method that updates the user info, the username and password are required in the body of the json
router.post('/update/:email', checkAuthenticated, async (req, res) => {
  try {
    console.log('Info: \n');
    console.log('Email: ' + req.params.email + '\n');
    console.log('Password: ' + req.body.password);
    if (req.user.email === req.params.email) {
      const userInfo = await playerController.updatePlayer(req.params.email, req.body.username, req.body.password);
      res.send('User updated ' + userInfo.rows[0].email.trim());
    }
  } catch (error) {
    console.error('Error updating user info', error);
    res.status(500).send('Internal Server Error');
  }
});

//Method that deletes a user, this is NOT reversible
router.delete('/delete/:email', checkAuthenticated, async (req, res) => {
  try {
    if (req.user.email === req.params.email) {
      await playerController.deletePlayer(req.params.email);
      res.send('User deleted');
    }
    else {
      res.status(403).send('Forbidden');
    }
  } catch (error) {
    console.error('Error deleting user', error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router; // Export the router
