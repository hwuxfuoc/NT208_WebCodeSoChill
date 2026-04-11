// backend/models/comment.js
const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    authorId:       { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content:        { type: String, required: true },
    codeSnippet:    { type: String }, // Optional code snippet related to the comment
    imageUrl:       { type: String }, // Optional image URL related to the comment
    tags:           [{type: String}], // Optional tags for categorizing comments (e.g., "clarification", "solution", "feedback")
    likes:          { type: Number, default: 0 },
    likeCount:      { type: Number, default: 0 },
    commentCount:   { type: Number, default: 0 }, // Number of replies to this comment

    createdAt:      { type: Date, default: Date.now },
    updatedAt:      { type: Date, default: Date.now },
}, { timestamps: true });

commentSchema.pre('save', async function() {
    this.updatedAt = Date.now();
});

module.exports = mongoose.model('Comment', commentSchema); 