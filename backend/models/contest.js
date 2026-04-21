// backend/models/contest.js
const mongoose = require('mongoose');

const contestSchema = new mongoose.Schema({
    title:          { type: String, required: true },
    description:    { type: String, required: true },
    startTime:      { type: Date, required: true },
    endTime:        { type: Date, required: true },
    duration:       { type: Number, required: true }, // Duration in minutes

    problems:       [{ type: mongoose.Schema.Types.ObjectId, ref: 'Problem' }],
    participants:   [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

    ratedFor:       { type: String, enum: ['all', 'beginner', 'intermediate', 'advanced'], default: 'all' },
    isRated:        { type: Boolean, default: false },
    createdBy:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

}, { timestamps: true });

// Virtual field: tự tính status từ startTime/endTime, không lưu DB
// Tránh tình trạng status lưu trong DB bị lệch với thời gian thực tế
contestSchema.virtual('status').get(function () {
    const now = new Date();
    if (now < this.startTime) return 'upcoming';
    if (now > this.endTime) return 'ended';
    return 'ongoing';
});

// Cần bật virtuals khi dùng .toJSON() hoặc .toObject() (ví dụ khi res.json())
contestSchema.set('toJSON', { virtuals: true });
contestSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Contest', contestSchema);