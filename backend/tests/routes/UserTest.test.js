const request = require('supertest');
const express = require('express');
const router = require('../../routes/userRoutes');
const playerController = require('../../controllers/PlayerController');
const { pool } = require('../../db/index');

const app = express();
app.use(express.json());

// Test authentication middleware
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

describe('Player Routes', () => {
  let testPlayer;

  beforeEach(async () => {
    // Inserts a test player before each test
    testPlayer = await playerController.insertPlayer('test@example.com', 'test', 'password', 'testPicture');
  });

  afterEach(async () => {
    // Deletes the test player after each test
    await playerController.deletePlayer('test@example.com');
  });

  it('should get user info', async () => {
    const res = await request(app)
      .get('/test/get/test@example.com')
      .send();
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('email');
  });

  it('should update user info', async () => {
    const res = await request(app)
      .post('/test/update/test@example.com')
      .send({
        username: 'test',
        password: 'password',
        picture: 'testPicture2'
      });
    expect(res.statusCode).toEqual(200);
    expect(res.text).toEqual('User updated test@example.com');
  });

  it('should delete a user', async () => {
    const res = await request(app)
      .delete('/test/delete/test@example.com')
      .send();
    expect(res.statusCode).toEqual(200);
    expect(res.text).toEqual('User deleted');
  });
});