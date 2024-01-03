const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Joi = require('joi');
const zxcvbn = require('zxcvbn');
const User = require('../models/User');

exports.signup = async (req, res) => {
    // Validate request body
    const { error } = Joi.object({
        username: Joi.string().alphanum().min(3).max(30).required(),
        password: Joi.string().alphanum().min(3).max(30).required(),
    }).validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // Check password strength
    const passwordStrength = zxcvbn(req.body.password);
    if (passwordStrength.score < 3) {
        return res.status(400).send('Password is too weak.');
    }

    // Check if user already exists
    let user = await User.findOne({ username: req.body.username });
    if (user) return res.status(400).send('User already exists');

    // Create new user
    user = new User(req.body);
    await user.save();

    // Generate JWT
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
    res.header('auth-token', token).send(token);
};

exports.login = async (req, res) => {
    // Validate request body
    const { error } = Joi.object({
        username: Joi.string().required(),
        password: Joi.string().required(),
    }).validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // Check if user exists
    const user = await User.findOne({ username: req.body.username });
    if (!user) return res.status(400).send('User does not exist');

    // Check password
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(400).send('Invalid password');

    // Generate JWT
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
    res.header('auth-token', token).send(token);
};