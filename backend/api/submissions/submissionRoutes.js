// backend/api/submission/submissionRoutes.js
const express = require('express');
const router = express.Router();
const { submit, run, getSubmission, getMySubmissions } = require('./submissionController');
const auth = require('../../middleware/auth');

// /my và /run phải đặt TRƯỚC /:id
router.get('/my', auth, getMySubmissions);
router.post('/run', auth, run);
router.post('/', auth, submit);
router.get('/:id', auth, getSubmission);

module.exports = router;