const Joi = require('joi');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const schema = Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required(),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
    role: Joi.string().valid('admin', 'sponsor', 'user').required(),
});

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
        type: String,
        enum: ['admin', 'sponsor', 'user'],
        default: 'user'
    },
});

UserSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

UserSchema.methods.verifyPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

module.exports = {
    User: mongoose.model('User', UserSchema),
    validateUser: (user) => schema.validate(user)
};