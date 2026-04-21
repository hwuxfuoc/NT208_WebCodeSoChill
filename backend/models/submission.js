// backend/models/submission.js
const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
    userId:             { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    problemId:          { type: mongoose.Schema.Types.ObjectId, ref: 'Problem', required: true },
    contestId:          { type: mongoose.Schema.Types.ObjectId, ref: 'Contest', default: null },

    language:           { type: String, required: true }, 
    code:               { type: String, required: true },

    status:             {type: String, enum: ['pending', 'accepted', 'wrong_answer', 'time_limit_exceeded', 'runtime_error', 'compile_error', 'memory_limit_exceeded'], default: 'pending'},

    // Detailed results for each test case
    testResult: [{
        testCaseOrder:  { type: Number, required: true },
        status:         {type: String, enum: ['accepted', 'wrong_answer', 'time_limit_exceeded', 'runtime_error', 'compile_error', 'memory_limit_exceeded'], required: true},
        executionTime:  { type: Number, default: 0 }, // ms
        memoryUsed:     { type: Number, default: 0 }, // MB
        output:         { type: String },
    }],

    // Overall stats
    timeUsed:           { type: Number, default: 0 }, // ms
    memoryUsed:         { type: Number, default: 0 }, // MB
    passedTests:        { type: Number, default: 0 },
    totalTests:         { type: Number, default: 0 },

}, { timestamps: true });

module.exports = mongoose.model('Submission', submissionSchema);