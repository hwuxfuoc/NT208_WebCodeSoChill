// backend/api/auth/authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const nodemailer = require('nodemailer');
const User = require('../../models/user');

// ─── Nodemailer transporter ────────────────────────────────────────────────
const createTransporter = () => nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT) || 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

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

            const userId = user._id.toString();
            const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '7d' });

            res.status(201).json({
                message: 'Đăng ký thành công',
                token,
                user: { id: userId, username: user.username, displayname: user.displayname, email: user.email, role: user.role }
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

            const userId = user._id.toString();
            const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '7d' });

            res.json({
                message: 'Đăng nhập thành công',
                token,
                user: { id: userId, username: user.username, displayname: user.displayname, email: user.email, avatarUrl: user.avatarUrl, role: user.role }
            });
        } catch (err) {
            console.error('Login error details:', err.message, err.stack);
            res.status(500).json({ message: 'Lỗi server: ' + err.message });
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

// @desc    Gửi mã 6 số về email để reset mật khẩu
// @route   POST /api/auth/forgotpassword
const forgotPassword = async (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Vui lòng nhập email' });

    try {
        const user = await User.findOne({ email });
        // Luôn trả về 200 để tránh lộ thông tin user có tồn tại hay không
        if (!user) {
            return res.json({ message: 'Nếu email tồn tại, mã xác nhận đã được gửi.' });
        }

        // Sinh mã 6 số ngẫu nhiên
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        const expire = new Date(Date.now() + 15 * 60 * 1000); // 15 phút

        user.resetPasswordCode = code;
        user.resetPasswordExpire = expire;
        await user.save();

        // Gửi email
        const transporter = createTransporter();
        await transporter.sendMail({
            from: `"WebCodeSoChill" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: '[WebCodeSoChill] Mã xác nhận đặt lại mật khẩu',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; background: #f9f9f9; border-radius: 12px; overflow: hidden;">
                    <div style="background: linear-gradient(135deg, #6366f1, #8b5cf6); padding: 32px; text-align: center;">
                        <h1 style="color: white; margin: 0; font-size: 24px;">WebCodeSoChill</h1>
                        <p style="color: rgba(255,255,255,0.85); margin: 8px 0 0;">Đặt lại mật khẩu</p>
                    </div>
                    <div style="padding: 32px; background: white;">
                        <p style="color: #374151; font-size: 15px;">Xin chào <strong>${user.displayname}</strong>,</p>
                        <p style="color: #374151; font-size: 15px;">Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn. Sử dụng mã xác nhận sau:</p>
                        <div style="background: #f3f4f6; border-radius: 12px; padding: 24px; text-align: center; margin: 24px 0;">
                            <span style="font-size: 42px; font-weight: 700; letter-spacing: 12px; color: #6366f1; font-family: monospace;">${code}</span>
                        </div>
                        <p style="color: #6b7280; font-size: 13px;">Mã có hiệu lực trong <strong>15 phút</strong>. Nếu bạn không yêu cầu đặt lại mật khẩu, hãy bỏ qua email này.</p>
                    </div>
                    <div style="background: #f3f4f6; padding: 16px; text-align: center;">
                        <p style="color: #9ca3af; font-size: 12px; margin: 0;">© 2025 WebCodeSoChill. All rights reserved.</p>
                    </div>
                </div>
            `,
        });

        res.json({ message: 'Nếu email tồn tại, mã xác nhận đã được gửi.' });
    } catch (err) {
        console.error('forgotPassword error:', err);
        res.status(500).json({ message: 'Lỗi server khi gửi email: ' + err.message });
    }
};

// @desc    Đặt lại mật khẩu bằng mã xác nhận
// @route   POST /api/auth/resetpassword
const resetPassword = async (req, res) => {
    const { email, code, newPassword } = req.body;
    if (!email || !code || !newPassword) {
        return res.status(400).json({ message: 'Vui lòng cung cấp đầy đủ email, mã xác nhận và mật khẩu mới' });
    }
    if (newPassword.length < 6) {
        return res.status(400).json({ message: 'Mật khẩu mới phải ít nhất 6 ký tự' });
    }

    try {
        const user = await User.findOne({ email });
        if (!user || !user.resetPasswordCode || !user.resetPasswordExpire) {
            return res.status(400).json({ message: 'Yêu cầu đặt lại mật khẩu không hợp lệ' });
        }
        if (user.resetPasswordCode !== code) {
            return res.status(400).json({ message: 'Mã xác nhận không đúng' });
        }
        if (user.resetPasswordExpire < new Date()) {
            return res.status(400).json({ message: 'Mã xác nhận đã hết hạn. Vui lòng yêu cầu mã mới.' });
        }

        const salt = await bcrypt.genSalt(10);
        user.hashedPassword = await bcrypt.hash(newPassword, salt);
        user.resetPasswordCode = null;
        user.resetPasswordExpire = null;
        await user.save();

        res.json({ message: 'Đặt lại mật khẩu thành công! Vui lòng đăng nhập.' });
    } catch (err) {
        console.error('resetPassword error:', err);
        res.status(500).json({ message: 'Lỗi server' });
    }
};

module.exports = { register, login, getMe, forgotPassword, resetPassword };
