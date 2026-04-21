// backend/api/submission/submissionController.js
const Submission = require('../../models/submission');
const Problem = require('../../models/problem');
const User = require('../../models/user');
const { runCode } = require('../../judge/runner');

// @desc    Nộp bài (Submit)
// @route   POST /api/submissions
const submit = async (req, res) => {
    const { problemId, language, code, contestId } = req.body;

    if (!problemId || !language || !code) {
        return res.status(400).json({ message: 'Thiếu problemId, language hoặc code' });
    }

    try {
        const problem = await Problem.findById(problemId);
        if (!problem) return res.status(404).json({ message: 'Bài tập không tồn tại' });

        // Tạo submission với trạng thái pending trước
        const submission = new Submission({
            userId: req.user.id,
            problemId,
            contestId: contestId || null,
            language,
            code,
            status: 'pending'
        });
        await submission.save();

        // Chạy judge
        const result = await runCode({ problemId, language, code, timeLimit: problem.timeLimit, memoryLimit: problem.memoryLimit });

        // Cập nhật kết quả
        submission.status = result.status;
        submission.testResult = result.testResult;
        submission.timeUsed = result.timeUsed;
        submission.memoryUsed = result.memoryUsed;
        submission.passedTests = result.passedTests;
        submission.totalTests = result.totalTests;
        await submission.save();

        // Cập nhật stats nếu accepted
        if (result.status === 'accepted') {
            // Kiểm tra user đã AC bài này chưa (tránh tăng totalSolved nhiều lần)
            const prevAC = await Submission.findOne({
                userId: req.user.id,
                problemId,
                status: 'accepted',
                _id: { $ne: submission._id }
            });
            if (!prevAC) {
                await User.findByIdAndUpdate(req.user.id, { $inc: { totalSolved: 1 } });
                await Problem.findByIdAndUpdate(problemId, {
                    $inc: { totalAccepted: 1, totalSubmissions: 1 }
                });
            } else {
                await Problem.findByIdAndUpdate(problemId, { $inc: { totalSubmissions: 1 } });
            }

            // Cập nhật acceptanceRate
            const p = await Problem.findById(problemId);
            p.acceptanceRate = p.totalSubmissions > 0 ? Math.round((p.totalAccepted / p.totalSubmissions) * 100) : 0;
            await p.save();
        } else {
            await Problem.findByIdAndUpdate(problemId, { $inc: { totalSubmissions: 1 } });
        }

        res.json({ message: 'Nộp bài thành công', submission });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Lỗi server' });
    }
};

// @desc    Chạy thử code (Run – không lưu submission)
// @route   POST /api/submissions/run
const run = async (req, res) => {
    const { problemId, language, code } = req.body;

    if (!problemId || !language || !code) {
        return res.status(400).json({ message: 'Thiếu problemId, language hoặc code' });
    }

    try {
        const problem = await Problem.findById(problemId);
        if (!problem) return res.status(404).json({ message: 'Bài tập không tồn tại' });

        // Chỉ chạy với sample testcases
        const result = await runCode({ problemId, language, code, timeLimit: problem.timeLimit, memoryLimit: problem.memoryLimit, sampleOnly: true });

        res.json({ result });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Lỗi server' });
    }
};

// @desc    Chi tiết một submission
// @route   GET /api/submissions/:id
const getSubmission = async (req, res) => {
    try {
        const submission = await Submission.findById(req.params.id)
            .populate('problemId', 'problemId title')
            .populate('userId', 'username displayname avatarUrl');

        if (!submission) return res.status(404).json({ message: 'Submission không tồn tại' });

        // Chỉ cho phép xem submission của chính mình (hoặc admin)
        if (submission.userId._id.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Không có quyền xem submission này' });
        }

        res.json({ submission });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Lỗi server' });
    }
};

// @desc    Lịch sử submission của bản thân
// @route   GET /api/submissions/my
const getMySubmissions = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        const submissions = await Submission.find({ userId: req.user.id })
            .populate('problemId', 'problemId title difficulty')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .select('-code -testResult');

        const total = await Submission.countDocuments({ userId: req.user.id });

        res.json({ submissions, total, page, totalPages: Math.ceil(total / limit) });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Lỗi server' });
    }
};

module.exports = { submit, run, getSubmission, getMySubmissions };