const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/users');
const router = express.Router();

function authCheck(req, res, next) {
	if (!req.session.userId) {
		return res.status(401).json({ error: 'Not authenticated' });
	}
	next();
}

router.get('/profile', authCheck, async (req, res) => {
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
});

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

		req.session.userId = user._id;
		res.json({ username: user.username, message: 'Login successful' });
	} catch (err) {
		console.error(`Error logging in user: ${username}`, err);
		res.status(500).json({ error: err.message });
	}
});

<<<<<<< HEAD
router.post('/signup', async (req, res) => {
	const { username, password } = req.body;

	try {
		console.log(`Attempting to signup user: ${username}`);

		const hashedPassword = await bcrypt.hash(password, 10);

		const user = new User({
			username,
			password: hashedPassword,
		});
		console.log('🚀 ~ file: login.js:49 ~ router.post ~ user:', user);
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
=======
module.exports = router;
>>>>>>> f778f4d40f8444826172833b6d9727e3c5c258c2
