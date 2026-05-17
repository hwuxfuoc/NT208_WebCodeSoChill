// backend/api/submission/submissionRoutes.js
const express = require('express');
const router = express.Router();
const { submit, run, getSubmission, getMySubmissions, getLastSubmissionForProblem, checkSolvedProblems } = require('./submissionController');
const auth = require('../../middleware/auth');

// Static paths phải đặt TRƯỚC /:id để tránh conflict
router.get('/my', auth, getMySubmissions);
router.post('/run', auth, run);
router.post('/check-solved', auth, checkSolvedProblems);
router.get('/problem/:problemId/last', auth, getLastSubmissionForProblem);
router.post('/', auth, submit);
router.get('/:id', auth, getSubmission);

module.exports = router;