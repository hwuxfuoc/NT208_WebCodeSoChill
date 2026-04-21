// backend/api/contest/contestRoutes.js
const express = require('express');
const router = express.Router();
const { getContests, getContest, getContestProblems, getContestLeaderboard, registerContest, createContest } = require('./contestController');
const auth = require('../../middleware/auth');
const adminOnly = require('../../middleware/adminOnly');

router.get('/', getContests);
router.post('/', auth, adminOnly, createContest);
router.get('/:id', getContest);
router.get('/:id/problems', auth, getContestProblems);
router.get('/:id/leaderboard', getContestLeaderboard);
router.post('/:id/register', auth, registerContest);

module.exports = router;