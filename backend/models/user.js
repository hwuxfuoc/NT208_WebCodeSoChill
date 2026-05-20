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
    // rank là virtual — tính từ experiencePoints, không lưu DB
    contestRating:          { type: Number, default: 0 },
    experiencePoints:       { type: Number, default: 0 },
    totalSolved:            { type: Number, default: 0 },
    streak:                 { type: Number, default: 0 },
    lastActiveDate:         { type: Date },

    role:                   { type: String, enum: ['user', 'admin'], default: 'user' },
    isVerified:             { type: Boolean, default: false },

    // Reset Password
    resetPasswordCode:      { type: String, default: null },
    resetPasswordExpire:    { type: Date, default: null },

}, { timestamps: true });

// ─── EXP → Rank virtual ────────────────────────────────────────────────────
// Tiers: Noob(0) Beginner(100) Amateur(300) Skilled(700)
//        Pro(1400) Expert(2400) Master(3800) Grandmaster(5500)
userSchema.virtual('rank').get(function () {
    const exp = this.experiencePoints || 0;
    if (exp >= 5500) return 'Grandmaster';
    if (exp >= 3800) return 'Master';
    if (exp >= 2400) return 'Expert';
    if (exp >= 1400) return 'Pro';
    if (exp >= 700)  return 'Skilled';
    if (exp >= 300)  return 'Amateur';
    if (exp >= 100)  return 'Beginner';
    return 'Noob';
});

// ─── EXP → Level virtual (100 EXP = 1 level, bắt đầu từ 1) ────────────────
userSchema.virtual('level').get(function () {
    const exp = this.experiencePoints || 0;
    return Math.floor(exp / 100) + 1;
});

// Bật virtuals để xuất hiện trong JSON response
userSchema.set('toJSON',   { virtuals: true });
userSchema.set('toObject', { virtuals: true });

// Use existing model if already compiled to avoid OverwriteModelError on hot-reload
module.exports = mongoose.models.User || mongoose.model('User', userSchema);
