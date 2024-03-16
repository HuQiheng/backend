//Requires
const passport = require('passport');
const {Strategy: GoogleStrategy} = require('passport-google-oauth20');
const jwt = require('jsonwebtoken');
require("dotenv").config();
const Player = require("../controllers/PlayerController");

passport.use(
    //specify the strategy to be used
    new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.SECRET_KEY,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
    }, async (accesToken, refreshToken, profile, done) => {
        //Accces user google profile
        const account = profile._json;
        console.log(account);
        try {
            //We look if the user exists
            const query = await Player.selectPlayeByname(account.name);
            if(query.rows.length === 0) {
                //create user
                await Player.insertPlayer(account.email, account.name, account.password);

                //WE NEED THE TOKEN STORED AND VERIFY

            } else {
                //The user does not exist generate the token and store it
                const user = {
                    name: account.name,
                    email: account.email
                };
                const secretKey = process.env.JWT_SECRET;
                const token = jwt.sign(user, secretKey);
                await Player.insertPlayer(account.email, account.name, account.password);
            }
            done(null,token)

        } catch (error) {
            done(error);
        }
    })
);


//Just the most simple confguration
passport.serializeUser((token, done) => {
    done(null,token);
});

passport.deserializeUser((token, done) => {
    done(null,token)
});