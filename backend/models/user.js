const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
        type: String,
        enum: ['admin', 'manager', 'worker'],
        default: 'worker'
    }
});

UserSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        console.log('Password before hashing:', this.password);
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

UserSchema.methods.verifyPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

const User = mongoose.model('User', UserSchema, 'users');

module.exports = User;