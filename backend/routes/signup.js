const express = require('express');
const User = require('../models/users');
const router = express.Router();

router.post('/', async (req, res) => {
    const { username, password } = req.body;

    try {
        console.log(`Attempting to signup user: ${username}`);

        const user = new User({
            username,
            password,
        });

        await user.save();

        console.log(`User created successfully: ${username}`);
        res.status(201).json({ message: 'User created successfully' });
    } catch (err) {
        console.error(`Error signing up user: ${username}`, err);
        console.error(err.stack);
        res.status(500).json({ err: err.message });
    }
});

module.exports = router;