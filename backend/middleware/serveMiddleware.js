const session = require('express-session');

//Every petition will have a session information, we use this as a middleware for express and socket
const sessionMiddleware = session({
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

//Just a wrapper for socket io 
const wrap = expressMiddleware => (socket, next) => 
expressMiddleware(socket.request, {}, next);

module.exports = {sessionMiddleware, wrap};