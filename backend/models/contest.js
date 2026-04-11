// backend/models/contest.js
const mongoose = require('mongoose');

const contestSchema = new mongoose.Schema({
    title:          { type: String, required: true },
    description:    { type: String, required: true },
    startTime:      { type: Date, required: true },
    endTime:        { type: Date, required: true },
    duration:       { type: Number, required: true }, // Duration in minutes
    status:         { type: String, enum: ['upcoming', 'ongoing', 'ended'], default: 'upcoming' },
    
    problems:       [{ type: mongoose.Schema.Types.ObjectId, ref: 'Problem' }], // List of problem IDs in the contest
    participants:   [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // List of user IDs participating in the contest

    ratedFor:       { type: String, enum: ['all', 'beginner', 'intermediate', 'advanced'], default: 'all' }, // Who can participate
    isRated:        { type: Boolean, default: false }, // Whether the contest affects user ratings
    createdBy:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt:      { type: Date, default: Date.now },
    updatedAt:      { type: Date, default: Date.now },
}, { timestamps: true });

contestSchema.pre('save', async function() {
    this.updatedAt = Date.now();
});

module.exports = mongoose.model('Contest', contestSchema); 