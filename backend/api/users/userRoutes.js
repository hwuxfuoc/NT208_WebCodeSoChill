// backend/api/user/userRoutes.js
const express = require('express');
const router = express.Router();
const { getProfile, getUserSubmissions, getUserStats, getLeaderboard, updateProfile, getUserCalendar, searchUsers } = require('./userController');
const auth = require('../../middleware/auth');

// Leaderboard và tìm kiếm phải đặt TRƯỚC /:username để tránh bị bắt nhầm thành username
router.get('/search', searchUsers);
router.get('/leaderboard', getLeaderboard);
router.put('/me', auth, updateProfile);
router.get('/:username', getProfile);
router.get('/:userId/submissions', getUserSubmissions);
router.get('/:userId/stats', getUserStats);
router.get('/:userId/calendar', getUserCalendar);

module.exports = router;