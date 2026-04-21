// backend/models/communityPost.js
const mongoose = require('mongoose');

const communityPostSchema = new mongoose.Schema({
    authorId:       { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content:        { type: String, required: true },
    codeSnippet:    { type: String },
    imageUrl:       { type: String },
    tags:           [{ type: String }],
    likeCount:      { type: Number, default: 0 },
    commentCount:   { type: Number, default: 0 },

}, { timestamps: true });

module.exports = mongoose.model('CommunityPost', communityPostSchema);