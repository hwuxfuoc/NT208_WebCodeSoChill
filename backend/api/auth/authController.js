// backend/api/auth/authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../../models/user');

const registerValidator = [
    body('username').notEmpty().withMessage('Username là bắt buộc'),
    body('email').isEmail().withMessage('Email không hợp lệ'),
    body('password').isLength({ min: 6 }).withMessage('Mật khẩu phải ít nhất 6 ký tự'),
    body('displayname').notEmpty().withMessage('Tên hiển thị là bắt buộc'),
];

const loginValidator = [
    body('email').isEmail().withMessage('Email không hợp lệ'),
    body('password').notEmpty().withMessage('Mật khẩu là bắt buộc'),
];

// @desc    Đăng ký user mới
// @route   POST /api/auth/register
const register = [
    ...registerValidator,
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { username, email, password, displayname, phone } = req.body;

        try {
            const existing = await User.findOne({ $or: [{ username }, { email }] });
            if (existing) {
                return res.status(400).json({ message: 'Username hoặc email đã tồn tại' });
            }

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            const user = new User({ username, email, hashedPassword, displayname, phone });
            await user.save();

            const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });

            res.status(201).json({
                message: 'Đăng ký thành công',
                token,
                user: { id: user.id, username: user.username, displayname: user.displayname, email: user.email, role: user.role }
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Lỗi server' });
        }
    }
];

// @desc    Đăng nhập
// @route   POST /api/auth/login
const login = [
    ...loginValidator,
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;

        try {
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(400).json({ message: 'Email hoặc mật khẩu không đúng' });
            }

            const isMatch = await bcrypt.compare(password, user.hashedPassword);
            if (!isMatch) {
                return res.status(400).json({ message: 'Email hoặc mật khẩu không đúng' });
            }

            const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });

            res.json({
                message: 'Đăng nhập thành công',
                token,
                user: { id: user.id, username: user.username, displayname: user.displayname, email: user.email, avatarUrl: user.avatarUrl, role: user.role }
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Lỗi server' });
        }
    }
];

// @desc    Lấy thông tin user đang đăng nhập
// @route   GET /api/auth/me
const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-hashedPassword');
        if (!user) return res.status(404).json({ message: 'User không tồn tại' });
        res.json({ user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Lỗi server' });
    }
};

module.exports = { register, login, getMe };
