// backend/models/problem.js
const mongoose = require('mongoose');

const problemSchema = new mongoose.Schema({
    problemId:          { type: String, required: true, unique: true }, // Ex: "001-A"
    title:              { type: String, required: true },
    description:        { type: String, required: true },
    difficulty:         { type: String, enum: ['easy', 'medium', 'hard'], required: true },
    tags:               { type: [String] },

    // Technical constraints
    timeLimit:          { type: Number, default: 1000 }, // ms
    memoryLimit:        { type: Number, default: 256 },  // MB

    // Examples hiển thị trong đề bài
    examples: [{
        input:          { type: String, required: true },
        output:         { type: String, required: true },
        explanation:    { type: String },
    }],

    constraints:        [{ type: String }],
    timeComplexityHint: { type: String },

    // Stats
    totalSubmissions:   { type: Number, default: 0 },
    totalAccepted:      { type: Number, default: 0 },
    acceptanceRate:     { type: Number, default: 0 }, // %

    // Video explanation
    videoUrl:           { type: String, default: '' },
    videoTitle:         { type: String, default: '' },

    isActive:           { type: Boolean, default: true },
    createdBy:          { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

}, { timestamps: true });

module.exports = mongoose.model('Problem', problemSchema);