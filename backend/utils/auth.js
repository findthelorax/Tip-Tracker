const jwt = require('jsonwebtoken');

function authenticate(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ error: 'You must be logged in to view this resource.' });
    }

    const token = authHeader.split(' ')[1]; // Bearer <token>

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = payload.id;
        next();
    } catch (err) {
        console.error('Error verifying JWT', err);
        res.status(401).json({ error: 'Invalid token.' });
    }
}

function requireRole(role) {
    return function(req, res, next) {
        if (req.role !== role) {
            return res.status(403).json({ error: 'Insufficient permissions' });
        }
        next();
    }
}

module.exports = { authenticate, requireRole };