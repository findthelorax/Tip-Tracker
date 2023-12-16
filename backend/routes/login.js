const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const router = express.Router();

router.post('/login', async (req, res) => {
	const { username, password } = req.body;

	try {
		console.log(`Attempting to login user: ${username}`);

		const user = await User.findOne({ username });

		if (!user) {
			console.log(`User not found: ${username}`);
			return res.status(400).json({ error: 'Invalid username or password' });
		}

		const passwordMatch = await bcrypt.compare(password, user.password);

		if (!passwordMatch) {
			console.log(`Password does not match for user: ${username}`);
			return res.status(400).json({ error: 'Invalid username or password' });
		}

		const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

		res.cookie('token', token, { httpOnly: true });
		res.json({ username: user.username, message: 'Login successful' });
	} catch (err) {
		console.error(`Error logging in user: ${username}`, err);
		res.status(500).json({ error: err.message });
	}
});

router.post('/signup', async (req, res) => {
	const { username, password } = req.body;

	try {
		console.log(`Attempting to signup user: ${username}`);

		const hashedPassword = await bcrypt.hash(password, 10);

		const user = new User({
			username,
			password: hashedPassword,
		});
		console.log("🚀 ~ file: login.js:49 ~ router.post ~ user:", user)
		console.log(`Password: ${password}`);
		console.log(`Hashed Password: ${hashedPassword}`);

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