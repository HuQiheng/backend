require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const {sessionMiddleware} = require('../middleware/serveMiddleware');
const bodyParser = require('body-parser');
const passport = require('passport');

require('../middleware/authGoogle');

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

const gameroutes = require('../routes/gamesRoutes');
app.use('/games',gameroutes);

// General error management
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('¡Algo salió mal!');
});


//Where using socket io, for game states
const { Server } = require("socket.io");

//Ditinguish between development and production
if(process.env.MODE_ENV === 'development'){
  
  //Create an http server
  const { createServer } = require("node:http");
  const httpServer = createServer(app);
  
  //Use same session context as express
  const io = new Server(httpServer);
  io.engine.use(sessionMiddleware);

  //Listen
  const host = 'localhost';
  httpServer.listen(3010, host,() => {
    console.log(`Server is listening on ${host}:${3010}`);
  });
}
else{
  //Create an https server
  const https = require('https');
  const fs = require('fs');
  
  const options = {
    key: fs.readFileSync('/etc/letsencrypt/live/wealthwars.games/privkey.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/wealthwars.games/fullchain.pem')
  };
  const httpsServer = https.createServer(options, app);

  //Using same session context as express
  const io = new Server(httpsServer);
  io.engine.use(sessionMiddleware);

  //Listen
  const host = process.env.CLIENT_URL;
  httpsServer.listen(3010, host, () => {
    console.log(`Server is listening on https://${host}:3010`);
  });
}
