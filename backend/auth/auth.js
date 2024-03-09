const jwt = require('jsonwebtoken');

const SECRET_KEY = 'your-secret-key';

const validateJWT = (req, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        throw new Error('Unauthorized');
    }

    const parts = authHeader.split(' ');

    if (parts.length !== 2) {
        throw new Error('Bad Request');
    }

    const token = parts[1];

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) {
            console.error(err);
            throw new Error('Unauthorized');
        }

        req.user = decoded;
        next();
    });
};

module.exports = {
    validateJWT
};