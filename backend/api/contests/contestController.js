// backend/api/contest/contestController.js
const Contest = require('../../models/contest');
const User = require('../../models/user');
const Submission = require('../../models/submission');

// @desc    Danh sách contest
// @route   GET /api/contests
const getContests = async (req, res) => {
    try {
        const contests = await Contest.find()
            .populate('createdBy', 'username displayname')
            .sort({ startTime: -1 });

        // Gắn virtual status vào response
        const contestsWithStatus = contests.map(c => c.toJSON());
        res.json({ contests: contestsWithStatus });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Lỗi server' });
    }
};

// @desc    Chi tiết một contest
// @route   GET /api/contests/:id
const getContest = async (req, res) => {
    try {
        const contest = await Contest.findById(req.params.id)
            .populate('createdBy', 'username displayname');
        if (!contest) return res.status(404).json({ message: 'Contest không tồn tại' });
        res.json({ contest: contest.toJSON() });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Lỗi server' });
    }
};

// @desc    Danh sách bài trong contest (chỉ user đã đăng ký)
// @route   GET /api/contests/:id/problems
const getContestProblems = async (req, res) => {
    try {
        const contest = await Contest.findById(req.params.id)
            .populate('problems', 'problemId title difficulty timeLimit memoryLimit tags');
        if (!contest) return res.status(404).json({ message: 'Contest không tồn tại' });

        const isParticipant = contest.participants.some(uid => uid.toString() === req.user.id);
        if (!isParticipant) return res.status(403).json({ message: 'Bạn chưa đăng ký contest này' });

        res.json({ problems: contest.problems });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Lỗi server' });
    }
};

// @desc    Bảng xếp hạng contest
// @route   GET /api/contests/:id/leaderboard
const getContestLeaderboard = async (req, res) => {
    try {
        const contest = await Contest.findById(req.params.id).populate('problems');
        if (!contest) return res.status(404).json({ message: 'Contest không tồn tại' });

        // Lấy tất cả submission của contest, group theo userId
        const submissions = await Submission.find({ contestId: req.params.id, status: 'accepted' })
            .populate('userId', 'username displayname avatarUrl')
            .populate('problemId', 'problemId');

        // Tính điểm: mỗi bài AC = 1 điểm (đơn giản hóa)
        const scoreMap = {};
        for (const sub of submissions) {
            const uid = sub.userId._id.toString();
            if (!scoreMap[uid]) {
                scoreMap[uid] = { user: sub.userId, solved: new Set(), lastAcceptedAt: sub.createdAt };
            }
            scoreMap[uid].solved.add(sub.problemId._id.toString());
            if (sub.createdAt > scoreMap[uid].lastAcceptedAt) {
                scoreMap[uid].lastAcceptedAt = sub.createdAt;
            }
        }

        const leaderboard = Object.values(scoreMap)
            .map(entry => ({ user: entry.user, solved: entry.solved.size, lastAcceptedAt: entry.lastAcceptedAt }))
            .sort((a, b) => b.solved - a.solved || a.lastAcceptedAt - b.lastAcceptedAt);

        res.json({ leaderboard });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Lỗi server' });
    }
};

// @desc    Đăng ký tham gia contest
// @route   POST /api/contests/:id/register
const registerContest = async (req, res) => {
    try {
        const contest = await Contest.findById(req.params.id);
        if (!contest) return res.status(404).json({ message: 'Contest không tồn tại' });

        const status = contest.toJSON().status;
        if (status === 'ended') return res.status(400).json({ message: 'Contest đã kết thúc' });

        if (contest.participants.includes(req.user.id)) {
            return res.status(400).json({ message: 'Bạn đã đăng ký contest này rồi' });
        }

        contest.participants.push(req.user.id);
        await contest.save();
        res.json({ message: 'Đăng ký thành công' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Lỗi server' });
    }
};

// @desc    Tạo contest mới (Admin only)
// @route   POST /api/contests
const createContest = async (req, res) => {
    try {
        const contest = new Contest({ ...req.body, createdBy: req.user.id });
        await contest.save();
        res.status(201).json({ message: 'Tạo contest thành công', contest });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Lỗi server' });
    }
};

module.exports = { getContests, getContest, getContestProblems, getContestLeaderboard, registerContest, createContest };