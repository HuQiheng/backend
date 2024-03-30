const express = require('express');
require('dotenv').config();
const app = express();
const cors = require('cors');
const session = require('express-session');
const bodyParser = require('body-parser');
const passport = require('passport');
const sharedsession = require("express-socket.io-session");
const socketIo = require('socket.io');

const https = require('https');
const fs = require('fs');

require('./middleware/authGoogle');

//Enable communication with our frontend
app.use(
  cors({
    credentials: true,
    origin: process.env.CLIENT_URL,
  })
);

//Body parser for post and update petitions
app.use(bodyParser.json());

//Every petition will have a session information
let expressSession = session({
  //You need to have the secret to generate the cookies
  secret: process.env.COOKIE_SECRET,
  cookie: {
    //In production this has to be true (but we can only work with https)
    secure: process.env.NODE_ENV === 'production' ? 'true' : 'auto',
    //Again on production it has to be none if set to lax secure has to be true
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  },
  resave: false,
  saveUninitialized: false,
});

app.use(expressSession);

//Passport for authentication
app.use(passport.initialize());
app.use(passport.session());

// Configure Socket.IO to share the Express session
let io = socketIo();
io.use(sharedsession(expressSession, {
  autoSave: true
}));

// Main page route
app.get('/', (req, res) => {
  // Only greets
  res.send('Bienvenido a la página de inicio');
});

//Authentication route
const authRoutes = require('./routes/authRoutes');
app.use('/auth', authRoutes);

const userRoutes = require('./routes/userRoutes');
app.use('/users', userRoutes);

const gameroutes = require('./routes/gamesRoutes');
app.use('/games',gameroutes);

// General error management
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('¡Algo salió mal!');
});

let host;
if(process.env.MODE_ENV === 'development'){
  host = 'localhost';
  app.listen(3010, host,() => {
    console.log(`Server is listening on ${host}:${3010}`);
  });
}
else{
  //Bring up https server
  const options = {
    key: fs.readFileSync('/etc/letsencrypt/live/wealthwars.games/privkey.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/wealthwars.games/fullchain.pem')
  };
  host = process.env.CLIENT_URL;
  https.createServer(options, app).listen(3010, host, () => {
    console.log(`Server is listening on https://${host}:3010`);
  });
}