const request = require('supertest');
const express = require('express');
const router = require('../../routes/userRoutes');

const app = express();
app.use(express.json());
app.use('/', router);

describe('Player Routes', () => {
  it('GET /get/:myID - should fetch user info', async () => {
    const myID = 'test-id'; // replace with a test id
    const res = await request(app).get(`/get/${myID}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('name');
    expect(res.body).toHaveProperty('email');
    // add more assertions based on the structure of your user info
  });

  it('POST /update/:myID - should update user info', async () => {
    const myID = 'test-id'; // replace with a test id
    const res = await request(app).post(`/update/${myID}`).send({
      username: 'new-username', // replace with test data
      password: 'new-password', // replace with test data
    });
    expect(res.statusCode).toEqual(200);
    expect(res.text).toEqual('User updated');
  });

  it('DELETE /delete/:myID - should delete user', async () => {
    const myID = 'test-id'; // replace with a test id
    const res = await request(app).delete(`/delete/${myID}`);
    expect(res.statusCode).toEqual(200);
    expect(res.text).toEqual('User deleted');
  });
});
