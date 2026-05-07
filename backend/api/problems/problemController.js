// backend/api/problem/problemController.js
const Problem = require('../../models/problem');
const Submission = require('../../models/submission');

// @desc    Danh sách bài tập (filter + pagination)
// @route   GET /api/problems
const getProblems = async (req, res) => {
    try {
        const { difficulty, tag, search, page = 1, limit = 20 } = req.query;
        const query = { isActive: true };

        if (difficulty) query.difficulty = difficulty;
        if (tag) query.tags = tag;
        if (search) query.title = { $regex: search, $options: 'i' };

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const problems = await Problem.find(query)
            .select('-testCases')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        const total = await Problem.countDocuments(query);

        // Calculate acceptance for each problem
        const problemsWithAcceptance = await Promise.all(problems.map(async (problem) => {
            const totalSubmissions = await Submission.countDocuments({ problemId: problem._id });
            const acceptedSubmissions = await Submission.countDocuments({ problemId: problem._id, status: 'accepted' });
            const acceptance = totalSubmissions > 0 ? (acceptedSubmissions / totalSubmissions) * 100 : 0;

            // Check if solved by current user
            let solved = false;
            if (req.user) {
                const userSubmission = await Submission.findOne({ problemId: problem._id, userId: req.user.id, status: 'accepted' });
                solved = !!userSubmission;
            }

            return {
                ...problem.toObject(),
                acceptance: Math.round(acceptance * 100) / 100, // round to 2 decimals
                solved
            };
        }));

        res.json({ problems: problemsWithAcceptance, total, page: parseInt(page), totalPages: Math.ceil(total / parseInt(limit)) });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Lỗi server' });
    }
};

// @desc    Chi tiết một bài tập
// @route   GET /api/problems/:id
const getProblem = async (req, res) => {
    try {
        const id = req.params.id;
        console.log('getProblem called with id:', id);

        // Try different ways to find the problem
        let problem = await Problem.findOne({ slug: id, isActive: true });
        console.log('Tried slug:', problem ? 'found' : 'not found');
        if (!problem) {
            problem = await Problem.findOne({ problemId: id, isActive: true });
            console.log('Tried problemId:', problem ? 'found' : 'not found');
        }
        if (!problem && id.match(/^[0-9a-fA-F]{24}$/)) {
            problem = await Problem.findOne({ _id: id, isActive: true });
            console.log('Tried _id:', problem ? 'found' : 'not found');
        }

        if (!problem) return res.status(404).json({ message: 'Bài tập không tồn tại' });

        problem = await Problem.populate(problem, { path: 'createdBy', select: 'username displayname' });
        res.json({ problem });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Lỗi server' });
    }
};;;;;

// @desc    Bài tập hàng ngày (random từ easy/medium)
// @route   GET /api/problems/daily
const getDailyProblem = async (req, res) => {
    try {
        // Dùng ngày hiện tại làm seed để mỗi ngày ra 1 bài cố định
        const today = new Date().toISOString().split('T')[0]; // "2025-01-15"
        const seed = today.split('-').join('');

        const count = await Problem.countDocuments({ isActive: true, difficulty: { $in: ['easy', 'medium'] } });
        const index = parseInt(seed) % count;

        const problem = await Problem.findOne({ isActive: true, difficulty: { $in: ['easy', 'medium'] } })
            .skip(index)
            .select('-constraints');

        res.json({ problem });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Lỗi server' });
    }
};

// @desc    Tạo bài tập mới (Admin only)
// @route   POST /api/problems
const createProblem = async (req, res) => {
    try {
        const problem = new Problem({ ...req.body, createdBy: req.user.id });
        await problem.save();
        res.status(201).json({ message: 'Tạo bài tập thành công', problem });
    } catch (err) {
        console.error(err);
        if (err.code === 11000) return res.status(400).json({ message: 'problemId đã tồn tại' });
        res.status(500).json({ message: 'Lỗi server' });
    }
};

// @desc    Cập nhật bài tập (Admin only)
// @route   PUT /api/problems/:id
const updateProblem = async (req, res) => {
    try {
        const problem = await Problem.findByIdAndUpdate(req.params.id, req.body, { returnDocument: 'after', runValidators: true });
        if (!problem) return res.status(404).json({ message: 'Bài tập không tồn tại' });
        res.json({ message: 'Cập nhật thành công', problem });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Lỗi server' });
    }
};

module.exports = { getProblems, getProblem, getDailyProblem, createProblem, updateProblem };