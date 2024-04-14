const request = require('supertest');
const express = require('express');
const router = require('../../routes/friendRoutes');
const playerController = require('../../controllers/PlayerController');
const friendController = require('../../controllers/FriendController');
const { pool } = require('../../db/index');

const app = express();
app.use(express.json());

app.use((req, res, next) => {
  req.user = {
    email: 'test@example.com',
  };
  req.isAuthenticated = () => true;
  next();
});

app.use('/test', router);

afterAll(() => {
  pool.end();
});

describe('Friend Routes', () => {
  let testPlayer;

  beforeEach(async () => {
    // Inserts a test player before each test
    testPlayer = await playerController.insertPlayer('test@example.com', 'test', 'password', 'testPicture');
    testPlayer1 = await friendController.insertFriend('friend1@example.com', 'test@example.com');
    testPlayer2 = await friendController.insertFriend('friend2@example.com', 'test@example.com');
    testPlayer3 = await friendController.insertFriend('test@example.com', 'friend1@example.com');
  });

  afterEach(async () => {
    // Deletes the test player after each test
    await playerController.deletePlayer('test@example.com');
    await friendController.removeFriend('friend1@example.com', 'test@example.com');
    await friendController.removeFriend('friend2@example.com', 'test@example.com');
    await friendController.removeFriend('test@example.com', 'friend1@example.com');
  });

  it('should get friends info', async () => {
    const res = await request(app).get('/test/get/test@example.com/friends').send();
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('email');
  });

  it('should add friend', async () => {
    const res = await request(app).post('/test/add/test@example.com/friends').send({
      friend: 'test4@example.com',
    });
    expect(res.statusCode).toEqual(200);
    expect(res.text).toEqual('Friend added');
  });

  it('should remove a friend', async () => {
    const res = await request(app).delete('/test/delete/test@example.com/friends').send({
      friend: 'test4@example.com',
    });
    expect(res.statusCode).toEqual(200);
    expect(res.text).toEqual('Friend deleted');
  });
});
