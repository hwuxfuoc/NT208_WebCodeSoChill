// backend/api/user/userRoutes.js
const express = require('express');
const router = express.Router();
const { getProfile, getUserSubmissions, getUserStats, getLeaderboard } = require('./userController');

// Leaderboard phải đặt TRƯỚC /:username để tránh bị bắt nhầm thành username
router.get('/leaderboard', getLeaderboard);
router.get('/:username', getProfile);
router.get('/:userId/submissions', getUserSubmissions);
router.get('/:userId/stats', getUserStats);

module.exports = router;