const express = require('express');
const router = express.Router();
const User = require('../models/users.js');

// Add a user
router.post('/', async (req, res) => {
    const user = new User(req.body);
    try {
        const savedUser = await user.save();
        res.json(savedUser);
    } catch (err) {
        res.json({ message: err });
    }
});

// Get one specific user
router.get('/:userId', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        res.json(user);
    } catch (err) {
        res.json({ message: err });
    }
});

// Get all users
router.get('/', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.json({ message: err });
    }
});

// Delete a user
router.delete('/:userId', async (req, res) => {
    try {
        const removedUser = await User.remove({ _id: req.params.userId });
        res.json(removedUser);
    } catch (err) {
        res.json({ message: err });
    }
});

module.exports = router;