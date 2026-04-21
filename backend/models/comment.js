// backend/models/comment.js
const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    postId:         { type: mongoose.Schema.Types.ObjectId, ref: 'CommunityPost', required: true }, // Bài post chứa comment này
    parentId:       { type: mongoose.Schema.Types.ObjectId, ref: 'Comment', default: null }, // null = top-level, có giá trị = reply của comment khác
    authorId:       { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content:        { type: String, required: true },
    codeSnippet:    { type: String },
    imageUrl:       { type: String },
    tags:           [{ type: String }],
    likeCount:      { type: Number, default: 0 },
    commentCount:   { type: Number, default: 0 }, // Số reply của comment này

}, { timestamps: true });

module.exports = mongoose.model('Comment', commentSchema);