// backend/api/auth/authRoutes.js
const express = require('express');
const router = express.Router();
const { register, login, getMe, forgotPassword, resetPassword } = require('./authController');
const auth = require('../../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/me', auth, getMe);
router.post('/forgotpassword', forgotPassword);
router.post('/resetpassword', resetPassword);

module.exports = router;