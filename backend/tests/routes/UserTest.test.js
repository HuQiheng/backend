const request = require('supertest');
const express = require('express');
const router = require('../../routes/userRoutes'); // replace with your router file
require('dotenv').config();

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

describe('POST /auth', () => {
  it('should authenticate a user', async () => {
    const token = process.env.TOKEN_PRUEBA; // replace with a test token
    console.log('token', token);
    const res = await request(app).post('/auth').send({ token }).expect(200);

    expect(res.body).toHaveProperty('status', 'success');
    expect(res.body).toHaveProperty('userId');
  });

  /* it('should return an error for invalid token', async () => {
        const token = 'invalid-token';

        const res = await request(app)
            .post('/auth')
            .send({ token })
            .expect(401);

        expect(res.body).toHaveProperty('status', 'error');
    });*/
});
