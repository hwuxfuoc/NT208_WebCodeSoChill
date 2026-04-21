// backend/models/user.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username:               { type: String, required: true, unique: true, trim: true },
    hashedPassword:         { type: String, required: true },
    displayname:            { type: String, required: true },
    email:                  { type: String, required: true, unique: true },
    avatarUrl:              { type: String, default: '' },
    avatarId:               { type: String, default: '' },
    bio:                    { type: String, default: '' },
    country:                { type: String, default: '' },
    phone:                  { type: String, default: '' },

    // Coding preferences (Settings → Account)
    preferredLanguages:     { type: [String], default: ['python'] }, // Array để hỗ trợ nhiều ngôn ngữ
    experienceLevel:        { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'beginner' },

    // Social links (Settings → Account)
    socialLinks: {
        github:             { type: String, default: '' },
        facebook:           { type: String, default: '' },
    },

    // Appearance settings (Settings → Appearance)
    appearance: {
        theme:              { type: String, enum: ['light', 'dark', 'system'], default: 'system' },
        editorTheme:        { type: String, default: 'monokai' },
        fontFamily:         { type: String, default: 'JetBrains Mono' },
        fontSize:           { type: Number, default: 14 },
        ligatures:          { type: Boolean, default: true },
    },

    // Stats (hiển thị ở Profile)
    rank:                   { type: String, default: 'Noob' }, // Noob -> Pro -> Expert -> Master
    contestRating:          { type: Number, default: 0 },
    experiencePoints:       { type: Number, default: 0 },
    totalSolved:            { type: Number, default: 0 },
    streak:                 { type: Number, default: 0 },
    lastActiveDate:         { type: Date },

    role:                   { type: String, enum: ['user', 'admin'], default: 'user' },
    isVerified:             { type: Boolean, default: false },

}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);