// backend/models/communityPost.js
const moogoose = require('mongoose');

const communityPostSchema = new moogoose.Schema({
    authorId:       { type: moogoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content:        { type: String, required: true },
    codeSnippet:    { type: String }, // Optional code snippet related to the post
    imageUrl:       { type: String }, // Optional image URL related to the post
    tags:           [{type: String}], // Optional tags for categorizing posts (e.g., "clarification", "solution", "feedback")
    likes:          { type: Number, default: 0 },
    likeCount:      { type: Number, default: 0 },
    commentCount:   { type: Number, default: 0 }, // Number of comments on this post
    
    createdAt:      { type: Date, default: Date.now },
    updatedAt:      { type: Date, default: Date.now },
}, { timestamps: true });

communityPostSchema.pre('save', async function() {
    this.updatedAt = Date.now();
});

module.exports = moogoose.model('CommunityPost', communityPostSchema); 