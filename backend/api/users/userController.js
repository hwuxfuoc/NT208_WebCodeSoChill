// backend/api/user/userController.js
const User = require('../../models/user');
const Submission = require('../../models/submission');

// @desc    Xem profile công khai của user
// @route   GET /api/users/:username
const getProfile = async (req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username })
            .select('-hashedPassword -email -phone -appearance');
        if (!user) return res.status(404).json({ message: 'User không tồn tại' });
        res.json({ user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Lỗi server' });
    }
};

// @desc    Lịch sử nộp bài của user
// @route   GET /api/users/:userId/submissions
const getUserSubmissions = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        const submissions = await Submission.find({ userId: req.params.userId })
            .populate('problemId', 'problemId title difficulty')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .select('-code -testResult'); // Không trả code và chi tiết từng test để nhẹ response

        const total = await Submission.countDocuments({ userId: req.params.userId });

        res.json({ submissions, total, page, totalPages: Math.ceil(total / limit) });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Lỗi server' });
    }
};

// @desc    Thống kê của user (Profile)
// @route   GET /api/users/:userId/stats
const getUserStats = async (req, res) => {
    try {
        const user = await User.findById(req.params.userId)
            .select('totalSolved streak contestRating experiencePoints rank');
        if (!user) return res.status(404).json({ message: 'User không tồn tại' });

        // Đếm số bài AC theo từng độ khó
        const solvedByDifficulty = await Submission.aggregate([
            { $match: { userId: user._id, status: 'accepted' } },
            { $group: { _id: '$problemId' } }, // Unique problem
            {
                $lookup: {
                    from: 'problems',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'problem'
                }
            },
            { $unwind: '$problem' },
            { $group: { _id: '$problem.difficulty', count: { $sum: 1 } } }
        ]);

        res.json({ stats: user, solvedByDifficulty });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Lỗi server' });
    }
};

// @desc    Bảng xếp hạng toàn hệ thống
// @route   GET /api/users/leaderboard
const getLeaderboard = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 50;
        const skip = (page - 1) * limit;

        const users = await User.find()
            .select('username displayname avatarUrl totalSolved contestRating rank')
            .sort({ contestRating: -1, totalSolved: -1 })
            .skip(skip)
            .limit(limit);

        const total = await User.countDocuments();

        res.json({ users, total, page, totalPages: Math.ceil(total / limit) });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Lỗi server' });
    }
};

// @desc    Cập nhật profile của user (Chính user đó)
// @route   PUT /api/users/me
const updateProfile = async (req, res) => {
    try {
        const { displayname, bio, phone, avatarUrl, preferredLanguages, experienceLevel, socialLinks } = req.body;
        
        const user = await User.findByIdAndUpdate(
            req.user.id,
            {
                displayname,
                bio,
                phone,
                avatarUrl,
                preferredLanguages,
                experienceLevel,
                socialLinks,
            },
            { returnDocument: 'after', runValidators: true }
        ).select('-hashedPassword');
        
        if (!user) return res.status(404).json({ message: 'User không tồn tại' });
        res.json({ message: 'Cập nhật thành công', user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Lỗi server' });
    }
};

module.exports = { getProfile, getUserSubmissions, getUserStats, getLeaderboard, updateProfile };