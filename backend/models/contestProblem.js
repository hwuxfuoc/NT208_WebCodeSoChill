// backend/models/contestProblem.js
// Model này lưu mối quan hệ giữa Contest và Problem,
// kèm thông tin bổ sung như điểm số, thứ tự bài trong contest.
// Nếu dùng model này thì bỏ mảng problems[] trong contest.js đi.
const mongoose = require('mongoose');

const contestProblemSchema = new mongoose.Schema({
    contestId:      { type: mongoose.Schema.Types.ObjectId, ref: 'Contest', required: true },
    problemId:      { type: mongoose.Schema.Types.ObjectId, ref: 'Problem', required: true },
    order:          { type: Number, required: true },   // Thứ tự bài trong contest: A=1, B=2, ...
    maxScore:       { type: Number, default: 100 },     // Điểm tối đa cho bài này trong contest

}, { timestamps: true });

// Đảm bảo mỗi cặp (contestId, problemId) là duy nhất
contestProblemSchema.index({ contestId: 1, problemId: 1 }, { unique: true });

module.exports = mongoose.model('ContestProblem', contestProblemSchema);