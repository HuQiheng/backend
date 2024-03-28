const request = require('supertest');
const express = require('express');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const router = require('../../routes/gamesRoutes');

const app = express();
app.use(express.json());
app.use('/', router);

let server;

beforeAll(() => {
  server = app.listen(); // start server
});

afterAll((done) => {
  server.close(done); // close server after all tests
});

describe('POST /games', () => {
  it('should create a game room', async () => {
    // Generate a test JWT
    const secretKey = process.env.SECRET_KEY;
    const payload = { email: 'hvmouse@gmail.com' }; // replace with your payload
    const testJwt = jwt.sign(payload, secretKey);

    const testPlayer = 'Hugo';

    const res = await request(app).post('/games').send({ jwt: testJwt, player: testPlayer }).expect(200);

    expect(res.body).toHaveProperty('code');
  });
});
