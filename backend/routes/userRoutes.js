const express = require('express');
const router = express.Router();
const auth = require('../auth/auth');
const { getUserInfo } = require('../db/index');
const { Client } = require('pg');


router.get('/users/:id', auth.validateJWT, async (req, res) => {
    const id = Number(req.params.id);
    const jwtId = Number(req.user.id);

    if (id !== jwtId) {
        return res.status(403).json({ error: 'Forbidden' });
    }

    try {
        const userInfo = await getUserInfo(id);
        res.json(userInfo);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;