// backend/middleware/optionalAuth.js
// Like auth.js but does NOT reject unauthenticated requests.
// If a valid token is present, req.user is populated; otherwise req.user stays undefined.
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const optionalAuth = async (req, _res, next) => {
    const authHeader = req.header('authorization');
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return next(); // no token → anonymous access, continue

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select('_id role');
        if (user) {
            req.user = { id: user._id.toString(), role: user.role };
        }
    } catch (_err) {
        // Invalid / expired token → treat as anonymous, don't block
    }
    next();
};

module.exports = optionalAuth;
