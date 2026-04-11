// backend/models/submission.js
const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
    userId:             { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    problemId:          { type: mongoose.Schema.Types.ObjectId, ref: 'Problem', required: true },
    contestId:          { type: mongoose.Schema.Types.ObjectId, ref: 'Contest', default: null }, // Optional, if submission is for a contest problem

    language:           { type: String, required: true }, // Ex: "python", "javascript", "cpp"
    code:               { type: String, required: true },

    status:             { type: String, enum: ['pending', 'accepted', 'wrong_answer', 'time_limit_exceeded', 'runtime_error', 'compile_error', 'memory_limit_exceeded'], default: 'pending' },

    // Detailed results for each test case
    testResult: [{
        testCaseOrder:  { type: Number, required: true }, // Order of the test case
        status:         { type: String, enum: ['accepted', 'wrong_answer', 'time_limit_exceeded', 'runtime_error', 'compile_error', 'memory_limit_exceeded'], required: true },
        executionTime:  { type: Number, default: 0 }, // ms
        memoryUsed:     { type: Number, default: 0 }, // MB
        output:         { type: String }, // Actual output from the user's code 
    }],

    // Overall stats for the submission
    timeUsed:           { type: Number, default: 0 }, // ms
    memoryUsed:         { type: Number, default: 0 }, // MB
    passedTests:        { type: Number, default: 0 },
    totalTests:         { type: Number, default: 0 },

    createdAt:          { type: Date, default: Date.now },
    updatedAt:          { type: Date, default: Date.now },
}, { timestamps: true });

problemSchema.pre('save', async function() {
    this.updatedAt = Date.now();
});

module.exports = mongoose.model('Submission', submissionSchema); 