// backend/api/auth/authRoutes.js
const express = require('express');
const router = express.Router();
const { register, login, getMe } = require('./authController');
const auth = require('../../middleware/auth');

router.post('/register', register);
router.post('/login', (req, res, next) => {
    console.log('>>> LOGIN ROUTE HIT');
    next();
}, login);
router.get('/me', auth, getMe);

module.exports = router;