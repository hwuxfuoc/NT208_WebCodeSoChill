// backend/models/testCase.js
const moogoose = require('mongoose');

const testCaseSchema = new moogoose.Schema({
    problemId:  { type: moogoose.Schema.Types.ObjectId, ref: 'Problem', required: true }, // Ex: 001-A
    input:      { type: String, required: true },
    output:     { type: String, required: true },
    isSample:   { type: Boolean, default: false }, // True for sample test cases, false for hidden test cases
    order:      { type: Number, default: 0, required: true }, // Order of the test case for a problem
    createdAt:  { type: Date, default: Date.now },
    updatedAt:  { type: Date, default: Date.now },
}, { timestamps: true });

testCaseSchema.pre('save', async function() {
    this.updatedAt = Date.now();
});

module.exports = moogoose.model('TestCase', testCaseSchema); 