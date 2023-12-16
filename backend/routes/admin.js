const express = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');
const User = require('../models/users'); // Assuming you have a User model

const router = express.Router();

router.get('/register', ensureAdmin, (req, res) => {
	res.render('adminRegister'); // Render the admin registration page
});

router.post('/register', ensureAdmin, async (req, res) => {
    try {
	const { username, password } = req.body;
	console.log("🚀 ~ file: admin.js:14 ~ router.post ~ password:", password)
	console.log("🚀 ~ file: admin.js:14 ~ router.post ~ username:", username)

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
    
    console.log("🚀 ~ file: admin.js:23 ~ router.post ~ existingUser:", existingUser)
	// Hash the password
	const hashedPassword = await bcrypt.hash(password, 10);

	// Create a new admin user
	const user = new User({
        username,
		password: hashedPassword,
		role: 'admin',
	});
    
    console.log("🚀 ~ file: admin.js:36 ~ router.post ~ username:", username)
    console.log("🚀 ~ file: admin.js:32 ~ router.post ~ user:", user)
	await user.save();

	res.redirect('/admin'); // Redirect to the admin dashboard
} catch (error) {
    console.log("🚀 ~ file: admin.js:47 ~ router.post ~ error:", error)
	res.status(500).send(error.message);
}
});

function ensureAdmin(req, res, next) {
	if (req.isAuthenticated() && req.user.role === 'admin') {
		return next();
	}

	res.redirect('/login'); // Redirect non-admins to the login page
}

module.exports = router;
