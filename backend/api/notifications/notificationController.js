// backend/api/notification/notificationController.js
const Notification = require('../../models/notification');

// @desc    Lấy danh sách thông báo của mình
// @route   GET /api/notifications
const getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ userId: req.user.id })
            .sort({ createdAt: -1 })
            .limit(50);
        const unreadCount = await Notification.countDocuments({ userId: req.user.id, isRead: false });
        res.json({ notifications, unreadCount });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Lỗi server' });
    }
};

// @desc    Đánh dấu một thông báo đã đọc
// @route   PUT /api/notifications/:id/read
const markAsRead = async (req, res) => {
    try {
        const notification = await Notification.findOneAndUpdate(
            { _id: req.params.id, userId: req.user.id },
            { isRead: true },
            { new: true }
        );
        if (!notification) return res.status(404).json({ message: 'Thông báo không tồn tại' });
        res.json({ notification });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Lỗi server' });
    }
};

// @desc    Đánh dấu tất cả đã đọc
// @route   PUT /api/notifications/read-all
const markAllAsRead = async (req, res) => {
    try {
        await Notification.updateMany({ userId: req.user.id, isRead: false }, { isRead: true });
        res.json({ message: 'Đã đánh dấu tất cả là đã đọc' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Lỗi server' });
    }
};

// @desc    Xóa tất cả thông báo
// @route   DELETE /api/notifications
const deleteAll = async (req, res) => {
    try {
        await Notification.deleteMany({ userId: req.user.id });
        res.json({ message: 'Đã xóa tất cả thông báo' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Lỗi server' });
    }
};

module.exports = { getNotifications, markAsRead, markAllAsRead, deleteAll };