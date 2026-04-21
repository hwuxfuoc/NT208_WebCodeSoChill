// backend/middleware/adminOnly.js
// Dùng sau middleware auth – kiểm tra user có role admin không
const adminOnly = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Chỉ admin mới có quyền thực hiện thao tác này' });
    }
    next();
};

module.exports = adminOnly;