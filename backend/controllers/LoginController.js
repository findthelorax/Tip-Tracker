const jwt = require('jsonwebtoken');
const { User } = require('../models/database');

exports.getLogin = (req, res) => {
    res.render('login'); // Render the login page
};

exports.login = async (req, res) => {
    const { username, password } = req.body;
    console.log("🚀 ~ file: LoginController.js:13 ~ exports.login= ~ username:", username)

    try {
        const user = await User.findOne({ username });

        if (!user || !(await user.verifyPassword(password))) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.cookie('token', token, { httpOnly: true });
        res.status(200).json({ username: user.username, role: user.role, message: 'Login successful' });
    } catch (err) {
        console.error(`Error logging in user: ${username}`, err);
        res.status(500).json({ error: err.message });
    }
};

exports.signup = async (req, res) => {
    const { username, password } = req.body;
    console.log("🚀 ~ file: LoginController.js:39 ~ exports.signup= ~ username:", username)

    try {
        const user = new User({
            username,
            password,
        });
        await user.save();

        res.status(201).json({ message: 'User created successfully' });
    } catch (err) {
        console.error(`Error signing up user: ${username}`, err);
        res.status(500).json({ err: err.message });
    }
};

exports.profile = async (req, res) => {
    try {
        const user = await User.findById(req.session.userId).select('-password');
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
    } catch (err) {
        console.error('Error getting user profile', err);
        res.status(500).json({ error: err.message });
    }
};

exports.updateProfile = async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['username', 'password', 'email']; // Add the fields that you want to allow updates for
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' });
    }

    try {
        const user = await User.findById(req.session.userId);
        if (!user) {
            return res.status(404).send();
        }

        updates.forEach((update) => user[update] = req.body[update]);
        await user.save();

        res.send(user);
    } catch (e) {
        res.status(400).send(e);
    }
};

exports.deleteProfile = async (req, res) => {
    try {
        const user = await User.findById(req.session.userId);
        if (!user) {
            return res.status(404).send();
        }

        await user.remove();
        res.send(user);
    } catch (e) {
        res.status(500).send();
    }
};