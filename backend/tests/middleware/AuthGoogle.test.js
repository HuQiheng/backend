// Requires
const passport = require('passport');
const { Strategy: GoogleStrategy } = require('passport-google-oauth20');
const Player = require('../../controllers/PlayerController');
const request = require('supertest');
const express = require('express');
const app = express();
app.use(passport.initialize());

//This is the uri that we expect to be obtained wiht this user
const redirect_uri =
  'https://accounts.google.com/o/oauth2/v2/auth?response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A3010%2Fauth%2Fgoogle%2Fcallback&scope=email%20profile&client_id=528032898405-i2majo762n534rs0n10u6t16gid8ltds.apps.googleusercontent.com';
// Tests
describe('Google OAuth', () => {
  it('should authenticate user with Google', async () => {
    passport.use(
      new GoogleStrategy(
        {
          clientID: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.SECRET_KEY,
          callbackURL: process.env.GOOGLE_CALLBACK_URL,
          scope: ['email', 'profile'],
        },
        (accessToken, refreshToken, profile, done) => {
          // Mock user data
          const user = {
            name: 'Test User',
            email: 'testuser@gmail.com',
            password: '123456',
          };
          done(null, user);
        }
      )
    );

    passport.serializeUser((user, done) => {
      done(null, user);
    });

    passport.deserializeUser((user, done) => {
      done(null, user);
    });

    app.get('/google', passport.authenticate('google', { failureRedirect: '/login' }), function (req, res) {
      res.redirect('/');
    });

    const response = await request(app).get('/google').expect(302);

    expect(response.headers.location).toBe(redirect_uri);
  });
});
