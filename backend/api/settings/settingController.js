// backend/api/setting/settingController.js
const bcrypt = require('bcryptjs');
const User = require('../../models/user');

// @desc    Cập nhật thông tin tài khoản
// @route   PUT /api/settings/account
const updateAccount = async (req, res) => {
    try {
        const { displayname, bio, country, phone, preferredLanguages, experienceLevel, socialLinks } = req.body;

        // Nếu đổi username, kiểm tra trùng
        if (req.body.username) {
            const existing = await User.findOne({ username: req.body.username, _id: { $ne: req.user.id } });
            if (existing) return res.status(400).json({ message: 'Username đã tồn tại' });
        }

        const updated = await User.findByIdAndUpdate(
            req.user.id,
            { displayname, bio, country, phone, preferredLanguages, experienceLevel, socialLinks, username: req.body.username },
            { new: true, runValidators: true }
        ).select('-hashedPassword');

        res.json({ message: 'Cập nhật thành công', user: updated });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Lỗi server' });
    }
};

// @desc    Cập nhật cài đặt giao diện
// @route   PUT /api/settings/appearance
const updateAppearance = async (req, res) => {
    try {
        const updated = await User.findByIdAndUpdate(
            req.user.id,
            { appearance: req.body },
            { new: true, runValidators: true }
        ).select('appearance');
        res.json({ message: 'Cập nhật giao diện thành công', appearance: updated.appearance });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Lỗi server' });
    }
};

// @desc    Đổi mật khẩu
// @route   PUT /api/settings/security/password
const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ message: 'Thiếu mật khẩu hiện tại hoặc mật khẩu mới' });
        }
        if (newPassword.length < 6) {
            return res.status(400).json({ message: 'Mật khẩu mới phải ít nhất 6 ký tự' });
        }

        const user = await User.findById(req.user.id);
        const isMatch = await bcrypt.compare(currentPassword, user.hashedPassword);
        if (!isMatch) return res.status(400).json({ message: 'Mật khẩu hiện tại không đúng' });

        const salt = await bcrypt.genSalt(10);
        user.hashedPassword = await bcrypt.hash(newPassword, salt);
        await user.save();

        res.json({ message: 'Đổi mật khẩu thành công' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Lỗi server' });
    }
};

module.exports = { updateAccount, updateAppearance, changePassword };