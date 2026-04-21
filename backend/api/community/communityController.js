// backend/api/community/communityController.js
const CommunityPost = require('../../models/communityPost');
const Comment = require('../../models/comment');

// @desc    Danh sách bài đăng (feed)
// @route   GET /api/community/posts
const getPosts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        const posts = await CommunityPost.find()
            .populate('authorId', 'username displayname avatarUrl rank')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await CommunityPost.countDocuments();
        res.json({ posts, total, page, totalPages: Math.ceil(total / limit) });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Lỗi server' });
    }
};

// @desc    Tạo bài đăng mới
// @route   POST /api/community/posts
const createPost = async (req, res) => {
    try {
        const { content, codeSnippet, imageUrl, tags } = req.body;
        if (!content) return res.status(400).json({ message: 'Nội dung không được để trống' });

        const post = new CommunityPost({ authorId: req.user.id, content, codeSnippet, imageUrl, tags });
        await post.save();
        await post.populate('authorId', 'username displayname avatarUrl');
        res.status(201).json({ message: 'Đăng bài thành công', post });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Lỗi server' });
    }
};

// @desc    Like / Unlike bài đăng
// @route   POST /api/community/posts/:id/like
const likePost = async (req, res) => {
    try {
        const post = await CommunityPost.findById(req.params.id);
        if (!post) return res.status(404).json({ message: 'Bài đăng không tồn tại' });

        // Toggle like (đơn giản: chỉ tăng/giảm count, không track ai đã like)
        post.likeCount += 1;
        await post.save();
        res.json({ likeCount: post.likeCount });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Lỗi server' });
    }
};

// @desc    Danh sách comment của bài đăng
// @route   GET /api/community/posts/:id/comments
const getComments = async (req, res) => {
    try {
        // Chỉ lấy top-level comments (parentId = null)
        const comments = await Comment.find({ postId: req.params.id, parentId: null })
            .populate('authorId', 'username displayname avatarUrl rank')
            .sort({ createdAt: -1 });

        res.json({ comments });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Lỗi server' });
    }
};

// @desc    Thêm comment vào bài đăng
// @route   POST /api/community/posts/:id/comments
const addComment = async (req, res) => {
    try {
        const { content, codeSnippet, parentId } = req.body;
        if (!content) return res.status(400).json({ message: 'Nội dung comment không được để trống' });

        const post = await CommunityPost.findById(req.params.id);
        if (!post) return res.status(404).json({ message: 'Bài đăng không tồn tại' });

        // Nếu là reply, kiểm tra parentId hợp lệ
        if (parentId) {
            const parent = await Comment.findById(parentId);
            if (!parent) return res.status(404).json({ message: 'Comment gốc không tồn tại' });
            await Comment.findByIdAndUpdate(parentId, { $inc: { commentCount: 1 } });
        }

        const comment = new Comment({
            postId: req.params.id,
            parentId: parentId || null,
            authorId: req.user.id,
            content,
            codeSnippet
        });
        await comment.save();
        await comment.populate('authorId', 'username displayname avatarUrl');

        // Tăng commentCount của post
        await CommunityPost.findByIdAndUpdate(req.params.id, { $inc: { commentCount: 1 } });

        res.status(201).json({ message: 'Thêm comment thành công', comment });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Lỗi server' });
    }
};

module.exports = { getPosts, createPost, likePost, getComments, addComment };