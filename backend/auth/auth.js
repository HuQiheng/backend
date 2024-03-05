const jwt = require('jsonwebtoken');
const SECRET_KEY = 'tu_clave_secreta'; // DEBUG

// const SECRET_KEY = process.env.JWT_SECRET;


// DEBUG, sustituir con algo así:
/*
app.post('/login', (req, res) => {
    // Authenticate the user, e.g. check the username and password in a database

    const payload = {
        id: user.id,
        username: user.username
    };

    const token = jwt.sign(payload, SECRET_KEY);

    res.json({ token });
});
*/
const payload = {
    id: 1,
    username: 'user'
};


const token = jwt.sign(payload, SECRET_KEY);

console.log(token);

const validateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;

    // Is necessary to check if the header is present
    if (!authHeader) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    // The header must have the following format
    const parts = authHeader.split(' ');

    if (parts.length !== 2) {
        return res.status(400).json({ error: 'Bad Request' });
    }

    const token = parts[1];

    // The token is verified
    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        // If the token is invalid, an error is returned
        if (err) {
            console.error(err);
            return res.status(401).json({ error: 'Unauthorized' });
        }

        req.user = decoded;
        next();
    });
};

module.exports = {
    validateJWT
};