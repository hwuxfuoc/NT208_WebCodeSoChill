// backend/middleware/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const auth = async (req, res, next) => {
    const authHeader = req.header('authorization');
    const token = authHeader && authHeader.split(' ')[1]; // "Bearer <token>"

    if (!token) {
        return res.status(401).json({ message: 'Không có token, truy cập bị từ chối' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Lấy thêm role từ DB để adminOnly middleware dùng được
        // Chỉ select id và role để giảm tải
        const user = await User.findById(decoded.id).select('_id role');
        if (!user) {
            return res.status(401).json({ message: 'Token không hợp lệ, user không tồn tại' });
        }

        req.user = { id: user._id.toString(), role: user.role };
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token không hợp lệ hoặc đã hết hạn' });
    }
};

module.exports = auth;