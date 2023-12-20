const { User } = require('../models/database');

exports.addUser = async (req, res) => {
    const { username, password, role } = req.body;
    const user = new User({ username, password, role });

    try {
        const savedUser = await user.save();
        res.json(savedUser);
    } catch (err) {
        res.json({ message: err });
    }
};

exports.getUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (req.userId !== user._id.toString()) {
            return res.status(403).json({ error: 'Insufficient permissions' });
        }

        res.json(user);
    } catch (err) {
        res.json({ message: err });
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        if (req.role === 'user') {
            return res.status(403).json({ error: 'Insufficient permissions' });
        }

        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.json({ message: err });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (req.role === 'user' && req.userId !== user._id.toString()) {
            return res.status(403).json({ error: 'Insufficient permissions' });
        }

        await user.remove();
        res.json({ message: 'User deleted successfully' });
    } catch (err) {
        res.json({ message: err });
    }
};

exports.changeUserRole = async (req, res) => {
    const { userId, newRole } = req.body;

    const validRoles = ['user', 'admin', 'root'];

    if (!validRoles.includes(newRole)) {
        return res.status(400).json({ error: 'Invalid role' });
    }

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (req.role === 'user' && req.userId !== user._id.toString()) {
            return res.status(403).json({ error: 'Insufficient permissions' });
        }

        user.role = newRole;
        await user.save();

        res.status(200).json({ message: 'User role updated successfully' });
    } catch (err) {
        console.error(`Error changing user role: ${userId}`, err);
        res.status(500).json({ error: err.message });
    }
};