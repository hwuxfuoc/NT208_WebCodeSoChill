// backend/api/problem/problemController.js
const Problem = require('../../models/problem');
const Submission = require('../../models/submission');

// @desc    Danh sách bài tập (filter + pagination) — Aggregation pipeline
// @route   GET /api/problems
const getProblems = async (req, res) => {
    try {
        const { difficulty, tag, search, page = 1, limit = 20 } = req.query;
        const pageNum = Math.max(1, parseInt(page));
        const limitNum = Math.min(100, Math.max(1, parseInt(limit))); // cap at 100
        const skip = (pageNum - 1) * limitNum;

        // Build match filter
        const matchFilter = { isActive: true };
        if (difficulty) matchFilter.difficulty = difficulty;
        if (tag) matchFilter.tags = tag;
        if (search) matchFilter.title = { $regex: search, $options: 'i' };

        // Build aggregation pipeline
        const pipeline = [
            { $match: matchFilter },
            { $sort: { createdAt: -1 } },
            { $skip: skip },
            { $limit: limitNum },
            // Exclude heavy fields
            { $project: { testCases: 0 } },
            // Lookup submissions to calculate acceptance in one go
            {
                $lookup: {
                    from: 'submissions',
                    localField: '_id',
                    foreignField: 'problemId',
                    pipeline: [
                        {
                            $group: {
                                _id: null,
                                total: { $sum: 1 },
                                accepted: {
                                    $sum: { $cond: [{ $eq: ['$status', 'accepted'] }, 1, 0] }
                                }
                            }
                        }
                    ],
                    as: '_submissionStats'
                }
            },
        ];

        // If user is logged in, also check solved status
        const userId = req.user ? req.user.id : null;
        if (userId) {
            const mongoose = require('mongoose');
            pipeline.push({
                $lookup: {
                    from: 'submissions',
                    let: { pid: '$_id' },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ['$problemId', '$$pid'] },
                                        { $eq: ['$userId', new mongoose.Types.ObjectId(userId)] },
                                        { $eq: ['$status', 'accepted'] }
                                    ]
                                }
                            }
                        },
                        { $limit: 1 },
                        { $project: { _id: 1 } }
                    ],
                    as: '_userSolved'
                }
            });
        }

        // Project final shape
        pipeline.push({
            $addFields: {
                acceptance: {
                    $let: {
                        vars: { stats: { $arrayElemAt: ['$_submissionStats', 0] } },
                        in: {
                            $cond: [
                                { $and: ['$$stats', { $gt: ['$$stats.total', 0] }] },
                                { $round: [{ $multiply: [{ $divide: ['$$stats.accepted', '$$stats.total'] }, 100] }, 2] },
                                0
                            ]
                        }
                    }
                },
                solved: userId
                    ? { $gt: [{ $size: { $ifNull: ['$_userSolved', []] } }, 0] }
                    : false
            }
        });

        // Remove internal fields
        pipeline.push({
            $project: { _submissionStats: 0, _userSolved: 0 }
        });

        const [problems, total] = await Promise.all([
            Problem.aggregate(pipeline),
            Problem.countDocuments(matchFilter)
        ]);

        res.json({
            problems,
            total,
            page: pageNum,
            totalPages: Math.ceil(total / limitNum)
        });
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

        // Try different ways to find the problem
        let problem = await Problem.findOne({ slug: id, isActive: true });
        if (!problem) {
            problem = await Problem.findOne({ problemId: id, isActive: true });
        }
        if (!problem && id.match(/^[0-9a-fA-F]{24}$/)) {
            problem = await Problem.findOne({ _id: id, isActive: true });
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