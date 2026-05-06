// backend/models/Problem.js
const mongoose = require('mongoose');

const testCaseSchema = new mongoose.Schema({
  input: String,
  expectedOutput: String,
  explanation: String,
}, { _id: false });

const sampleSchema = new mongoose.Schema({
  input: String,
  output: String,
  explanation: String,
}, { _id: false });

const problemSchema = new mongoose.Schema({
  isActive: { type: Boolean, default: true },
  problemId: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  difficulty: { type: String, enum: ['easy','medium','hard'], default: 'easy' },
  description: { type: String, default: '' },
  constraints: { type: String, default: '' },
  timeLimit: { type: Number, default: 1000 },
  memoryLimit: { type: Number, default: 64 },
  samples: [sampleSchema],
  testCases: [testCaseSchema],
  tags: { type: [String], default: [] },
  topics: { type: [String], default: [] },
  editorial: { type: String, default: '' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
}, { timestamps: true });
// Guard against re-defining the model on hot reloads
module.exports = mongoose.models.Problem || mongoose.model('Problem', problemSchema);
