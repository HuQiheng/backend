const request = require('supertest');
const express = require('express');
const session = require('express-session');
const router = require('../../routes/gamesRoutes');
const http = require('http');
const { Server } = require('socket.io');
const Client = require('socket.io-client');

const app = express();
app.use(express.json());

// Middleware para simular una sesión autenticada
app.use(session({
  secret: 'your secret',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // En producción, establece esto en true
}));

app.use((req, res, next) => {
  req.user = {
    email: 'test@example.com',
  };
  req.session.socketId = 'testSocketId'; // Añade un socketId a la sesión
  req.isAuthenticated = () => true;
  next();
});
app.use('/', router);

let server;
let io;
let client;

beforeAll((done) => {
  server = http.createServer(app);
  io = new Server(server);
  server.listen(3010, () => {
    console.log(`Server is listening on port ${server.address().port}`);
    done();
  });
});

afterAll((done) => {
  if (client) client.close();
  io.close();
  server.close(() => {
    console.log('Server has been closed');
    done();
  });
});

describe('POST /games', () => {
  it('should create a game room', (done) => {
    console.log(`Before test: server port = ${server.address().port}, io clients = ${Object.keys(io.sockets.sockets).length}`);

    const testPlayer = 'test';

    client = new Client(`http://localhost:${server.address().port}`);

    client.on('connect', async () => {
      console.log(`Client connected with id ${client.id}`);

      // Configura el oyente del evento 'Código de acceso' antes de enviar la solicitud POST
      client.once('Codigo de acceso', (code) => {
        expect(code).toBeDefined();
        done();
      });

      // Ahora envía la solicitud POST
      const res = await request(app).post('/games').send({ player: testPlayer }).expect(200);
      expect(res.body).toHaveProperty('code');
      client.close();

      console.log(`After test: server port = ${server.address().port}, io clients = ${Object.keys(io.sockets.sockets).length}`);
    });

    client.on("connect_error", (err) => {
      console.log(`Connection error: ${err.message}`);
      done();
    });
  }); // Increase timeout to 5 seconds
});