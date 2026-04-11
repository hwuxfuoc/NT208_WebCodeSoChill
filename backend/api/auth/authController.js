// backend/api/auth/authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); 
const { validationResult, body } = require('express-validator');
const User = require('../../models/user');

// Validate rules (sẽ dùng trong routes)
const registerValidator = [
  require('express-validator').body('username').notEmpty().withMessage('Username là bắt buộc'),
  require('express-validator').body('email').isEmail().withMessage('Email không hợp lệ'),
  require('express-validator').body('password').isLength({ min: 6 }).withMessage('Mật khẩu phải ít nhất 6 ký tự'),
  require('express-validator').body('displayname').notEmpty().withMessage('Tên hiển thị là bắt buộc'),
];

const loginValidator = [
  require('express-validator').body('email').isEmail().withMessage('Email không hợp lệ'),
  require('express-validator').body('password').notEmpty().withMessage('Mật khẩu là bắt buộc'),
];

// @desc    Đăng ký user mới
const register = [
  registerValidator,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password, displayname, phone } = req.body;

    try {
      // Kiểm tra username hoặc email đã tồn tại chưa
      let user = await User.findOne({ $or: [{ username }, { email }] });
      if (user) {
        return res.status(400).json({ message: 'Username hoặc email đã tồn tại' });
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Tạo user mới
      user = new User({
        username,
        email,
        hashedPassword,
        displayname,
        phone
      });

      await user.save();

      // Tạo JWT token
      const payload = { id: user.id };
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });

      res.status(201).json({
        message: 'Đăng ký thành công',
        token,
        user: {
          id: user.id,
          username: user.username,
          displayname: user.displayname,
          email: user.email
        }
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Lỗi server' });
    }
  }
];

// @desc    Đăng nhập
const login = [
  loginValidator,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      // Tìm user theo email
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: 'Email hoặc mật khẩu không đúng' });
      }

      // So sánh password
      const isMatch = await bcrypt.compare(password, user.hashedPassword);
      if (!isMatch) {
        return res.status(400).json({ message: 'Email hoặc mật khẩu không đúng' });
      }

      // Tạo token
      const payload = { id: user.id };
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });

      res.json({
        message: 'Đăng nhập thành công',
        token,
        user: {
          id: user.id,
          username: user.username,
          displayname: user.displayname,
          email: user.email,
          avatarUrl: user.avatarUrl
        }
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Lỗi server' });
    }
  }
];

// @desc    Lấy thông tin user hiện tại
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-hashedPassword'); // Không trả password
    if (!user) {
      return res.status(404).json({ message: 'User không tồn tại' });
    }
    res.json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

module.exports = { register, login, getMe };