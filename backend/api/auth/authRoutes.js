// backend/api/auth/auth.js 
const express = require('express');
const router = express.Router();
const { register, login, getMe } = require('./authController');
const auth = require('../../middleware/auth');

// @route   POST /api/auth/register
// @desc    Đăng ký user mới
// @access  Public
router.post('/register', register);

// @route   POST /api/auth/login
// @desc    Đăng nhập & trả về JWT token
// @access  Public
router.post('/login', login);

// @route   GET /api/auth/me
// @desc    Lấy thông tin user hiện tại
// @access  Private (cần token)
router.get('/me', auth, getMe);

module.exports = router;