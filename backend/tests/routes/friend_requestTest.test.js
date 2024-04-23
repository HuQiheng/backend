const request = require('supertest');
const express = require('express');
const router = require('../../routes/friend_requestRoutes');
const friends_reqController = require('../controllers/Friend_requestController');

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

describe('Friend Requests Routes', () => {
  beforeEach(async () => {
    await friends_reqController.insertFriend_Request('test@example.com', 'friend1@example.com');
  });

  afterEach(async () => {
    await friends_reqController.removeFriend_Request('test@example.com', 'friend1@example.com');
  });

  test('It should response the GET method', async () => {
    const response = await request(app).get('/test/test@example.com/friendRequests');
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('rows');
  });

  test('It should response the PUT method', async () => {
    const response = await request(app).put('/test/test@example.com/friendRequests').send({
      to: 'friend2@example.com',
    });
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('message', 'Friend request sent');
  });

  test('It should response the DELETE method', async () => {
    const response = await request(app).delete('/test/test@example.com/friendRequests').send({
      to: 'friend2@example.com',
    });
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('message', 'Request deleted');
  });
});
