require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const {sessionMiddleware, onlyForHandshake} = require('../middleware/serveMiddleware');
const bodyParser = require('body-parser');
const passport = require('passport');

const checkAuthenticated = require('../middleware/authGoogle');


//Enable cros comunication
app.use(
  cors({
    credentials: true,
  })
);

//Body parser for post and update petitions
app.use(bodyParser.json());
app.use(sessionMiddleware);

//Passport for authentication
app.use(passport.initialize());
app.use(passport.session());


// Main page route
app.get('/', (req, res) => {
  // Only greets
  res.send('Bienvenido a la página de inicio');
});

//Used routes
const authRoutes = require('../routes/authRoutes');
app.use('/auth', authRoutes);

const userRoutes = require('../routes/userRoutes');
app.use('/users', userRoutes);


// General error management
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('¡Algo salió mal!');
});



//To remove only tries for the socket io !!!!
app.set('view engine', 'ejs');

app.get('/create', (req, res) =>{
  res.render('createRoom');
});

app.get('/join', (req, res) => {
  res.render('joinRoom');
});

//Where using socket io, for game states
const { Server } = require("socket.io");
const { checkAuthenticatedSocketIO } = require('../middleware/authGoogle');
//Io definition
let io;
let server;
if(process.env.MODE_ENV === 'development'){
   //Create an http server
   const { createServer } = require("node:http");
   server = createServer(app);
   
 
}
else{
  //Create an https server
  const https = require('https');
  const fs = require('fs');
  
  const options = {
    key: fs.readFileSync('/etc/letsencrypt/live/wealthwars.games/privkey.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/wealthwars.games/fullchain.pem')
  };
  server = https.createServer(options, app);


}

//Use same session context as express and passport
io = new Server(server);
io.engine.use(sessionMiddleware);
io.engine.use(onlyForHandshake(passport.session()));

//IO error management
io.engine.use(
  onlyForHandshake((req, res, next) => {
    if (req.user) {
      next();
    } else {
      console.log("Unauthorized user")
      res.writeHead(401);
      res.end();
    }
  }),
);


//Listening
if(process.env.MODE_ENV === 'development'){
  const host = 'localhost';
  server.listen(3010, host,() => {
    console.log(`Server is listening on ${host}:${3010}`);
  });
}
else{
  const host = process.env.CLIENT_URL;
  server.listen(3010, host, () => {
    console.log(`Server is listening on https://${host}:3010`);
  });
}


const {createRoom, joinRoom, leaveRoom, startGame, rooms} = require('../middleware/game');
// Conexion de un socket
io.on('connection', (socket) => {
  console.log(socket.id);
  //The session
  const session = socket.request.session;
  //The user
  const user = socket.request.user;
  console.log("Socket ID: " + socket.id);
  // Comprueba si el cliente está autenticado
    console.log("User authenticated: " + JSON.stringify(user));
      // Guarda el socketId en la sesión
      // Crear sala
      socket.on('createRoom', (room) => createRoom(io,socket.id, room));

      // Unirse a sala
      socket.on('joinRoom', (room, code) => joinRoom(io,socket.id, room, code));

      // Salir de sala
      socket.on('leaveRoom', () => leaveRoom(socket.id));

      // Desconexion de un socket
      socket.on('disconnect', () => {
          console.log(`Jugador ${socket.id} desconectado`);
          leaveRoom(socket.id);
      });
});

module.exports = io;