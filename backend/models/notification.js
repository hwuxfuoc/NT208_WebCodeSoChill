// backend/models/notification.js
const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    userId:        { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type:          { type: String, enum: ['contest_start', 'contest_end', 'problem_update', 'general'], required: true },
    title:         { type: String, required: true },
    message:       { type: String, required: true },
    link:          { type: String }, // Optional link related to the notification (e.g., contest page, problem page)
    isRead:        { type: Boolean, default: false },
    
    createdAt:     { type: Date, default: Date.now },
    updatedAt:     { type: Date, default: Date.now },
}, { timestamps: true });

notificationSchema.pre('save', async function() {
    this.updatedAt = Date.now();
});

module.exports = mongoose.model('Notification', notificationSchema); 