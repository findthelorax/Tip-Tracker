const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const config = require('../config');

exports.login = async (req, res) => {
	const { username, password } = req.body;

	try {
		const user = await User.findOne({ username });

		if (!user) {
			return res.status(401).json({ error: 'Invalid username or password' });
		}

		const passwordMatch = await bcrypt.compare(password, user.password);

		if (!passwordMatch) {
			return res.status(401).json({ error: 'Invalid username or password' });
		}

		const token = jwt.sign({ id: user._id }, config.JWT_SECRET, { expiresIn: '1h' });

		res.cookie('token', token, { httpOnly: true });
		res.status(200).json({ username: user.username, role: user.role, message: 'Login successful' });
	} catch (err) {
		console.error(`Error logging in user: ${username}`, err);
		res.status(500).json({ error: 'Server error' });
	}
};
