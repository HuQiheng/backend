const express = require('express');
require('dotenv').config();
const app = express();
const cors = require('cors');
const session = require('express-session');
const bodyParser = require('body-parser');
const passport = require('passport');
require('./middleware/authGoogle');
const jwt = require('jsonwebtoken');

//Enable comuniccation with our fronted
app.use(
  cors({
    credentials: true,
    origin: process.env.CLIENT_URL,
  })
);

//Body parser for post and update petitions
app.use(bodyParser.json());

//Every petition will have a session information
app.use(
  session({
    //You need to have the secret to generate the cookies
    secret: process.env.COOKIE_SECRET,
    cookie: {
      //In productin this has to be true (but we can only work with https)
      secure: process.env.NODE_ENV === 'production' ? 'true' : 'auto',
      //Again on production it has to be none if set to lax secure has to be true
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    },
    resave: false,
    saveUninitialized: false,
  })
);

//Passport for authentification
app.use(passport.initialize());
app.use(passport.session());

// Main page route
app.get('/', (req, res) => {
  // Only greets
  res.send('Bienvenido a la página de inicio');
});

//Authentification route
const authRoutes = require('./routes/authRoutes');
app.use('/auth', authRoutes);

const userRoutes = require('./routes/userRoutes');
app.use('/users', userRoutes);

// General error management
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('¡Algo salió mal!');
});

app.listen(process.env.PORT_LISTEN || 3010, () => {
  console.log('Server is listening on port 3010');
});
