const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/users');
const router = express.Router();

// const rateLimit = require('express-rate-limit');
// const { body, validationResult } = require('express-validator');
// const loginLimiter = rateLimit({
// 	windowMs: 15 * 60 * 1000, // 15 minutes
// 	max: 100 // limit each IP to 100 requests per windowMs
//   });
//   router.post('/login', loginLimiter, [
// 	body('username').isLength({ min: 3 }),
// 	body('password').isLength({ min: 5 })
//   ], async (req, res) => {
// 	const errors = validationResult(req);
// 	if (!errors.isEmpty()) {
// 	  return res.status(400).json({ errors: errors.array() });
// 	}

// 	const { username, password } = req.body;

// 	try {
// 	  const user = await User.findOne({ username });

// 	  if (!user) {
// 		return res.status(400).json({ error: 'Invalid username or password' });
// 	  }

// 	  const passwordMatch = await bcrypt.compare(password, user.password);

// 	  if (!passwordMatch) {
// 		return res.status(400).json({ error: 'Invalid username or password' });
// 	  }

// 	  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

// 	  res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'none' });
// 	  res.json({ username: user.username, message: 'Login successful' });
// 	} catch (err) {
// 	  res.status(500).json({ error: 'Server error' });
// 	}
//   });

//   router.post('/signup', [
// 	body('username').isLength({ min: 3 }),
// 	body('password').isLength({ min: 5 })
//   ], async (req, res) => {
// 	const errors = validationResult(req);
// 	if (!errors.isEmpty()) {
// 	  return res.status(400).json({ errors: errors.array() });
// 	}

// 	const { username, password } = req.body;

// 	try {
// 	  const hashedPassword = await bcrypt.hash(password, 10);

// 	  const user = new User({
// 		username,
// 		password: hashedPassword,
// 	  });

// 	  await user.save();

// 	  res.status(201).json({ message: 'User created successfully' });
// 	} catch (err) {
// 	  res.status(500).json({ error: 'Server error' });
// 	}
//   });

router.post('/', async (req, res) => {
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

module.exports = router;