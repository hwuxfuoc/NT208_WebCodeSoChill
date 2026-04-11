// backend/models/problem.js
const mongoose = require('mongoose');

const problemSchema = new mongoose.Schema({
    problemId:          { type: String, required: true, unique: true }, // Ex: 001-A
    title:              { type: String, required: true },
    description:        { type: String, required: true },
    difficulty:         { type: String, enum: ['easy', 'medium', 'hard'], required: true },
    tags:               { type: [String] }, // Ex: ["array", "hash-table"]

    // Technical constraints
    timeLimit:          { type: Number, default: 1000 }, // ms
    memoryLimit:        { type: Number, default: 256 },  // MB

    // Examples
    examples: [{
        input:          { type: String, required: true },
        output:         { type: String, required: true },
        explanation:    { type: String },
    }],

    // Constraints (Description, Ex: "1 <= nums.length <= 10^5")
    constraints:        [{ type: String }],

    // Time Complexity Hint (Description, Ex: "O(n log n) or better")
    timeComplexityHint: { type: String },

    // Stats
    totalSubmissions:   { type: Number, default: 0 },
    totalAccepted:      { type: Number, default: 0 },
    acceptanceRate:     { type: Number, default: 0 }, // %

    // Video explanation (YouTube URL)
    videoUrl:           { type: String, default: '' },
    videoTitle:         { type: String, default: '' },

    isActive:           { type: Boolean, default: true },
    createdBy:          { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

    createdAt:          { type: Date, default: Date.now },
    updatedAt:          { type: Date, default: Date.now },
}, { timestamps: true });

problemSchema.pre('save', async function() {
    this.updatedAt = Date.now();
});

module.exports = mongoose.model('Problem', problemSchema); 