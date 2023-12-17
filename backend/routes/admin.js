const express = require('express');
const bcrypt = require('bcrypt');
const { User, schema } = require('../models/user');
const router = express.Router();

// function ensureAdmin(req, res, next) {
//     if (req.session.role === 'admin') {
//         return next();
//     }

//     res.redirect('/login'); // Redirect non-admins to the login page
// };

router.get('/register', (req, res) => {
    res.status(200).json({ message: 'Admin registration page' }); // Send a JSON response
});

router.post('/register', async (req, res) => {
	try {
		const { username, password } = req.body;

		// Validate the input
		const { error } = schema.validate({ username, password });
		if (error) {
			return res.status(400).send(error.details[0].message);
		}

		// Check if user already exists
		const existingUser = await User.findOne({ username });
		if (existingUser) {
			return res.status(400).send('User already exists');
		}

		// Create a new admin user
		const user = new User({
			username,
			password, // No need to hash the password here
			role: 'admin',
		});

		await user.save();

		res.redirect('/admin'); // Redirect to the admin dashboard
	} catch (error) {
		res.status(500).send(error.message);
	}
});

module.exports = router;