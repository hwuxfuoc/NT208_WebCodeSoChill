const express = require('express');
const router = express.Router();
const { getDailyProblemsChart, getContestStats } = require('./statsController');

router.get('/daily-problems', getDailyProblemsChart);
router.get('/contest-stats', getContestStats);

module.exports = router;
