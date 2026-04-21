// backend/models/testCase.js
const mongoose = require('mongoose');

const testCaseSchema = new mongoose.Schema({
    problemId:  { type: mongoose.Schema.Types.ObjectId, ref: 'Problem', required: true },
    input:      { type: String, required: true },
    output:     { type: String, required: true },
    isSample:   { type: Boolean, default: false }, // true = hiển thị trong đề, false = hidden testcase
    order:      { type: Number, default: 0, required: true },

}, { timestamps: true });

module.exports = mongoose.model('TestCase', testCaseSchema);