// backend/api/problem/problemRoutes.js
const express = require('express');
const router = express.Router();
const { getProblems, getProblem, getDailyProblem, createProblem, updateProblem } = require('./problemController');
const auth = require('../../middleware/auth');
const adminOnly = require('../../middleware/adminOnly');
const optionalAuth = require('../../middleware/optionalAuth');

// /daily phải đặt TRƯỚC /:id
router.get('/daily', getDailyProblem);
router.get('/', optionalAuth, getProblems);
router.get('/:id', getProblem);
router.post('/', auth, adminOnly, createProblem);
router.put('/:id', auth, adminOnly, updateProblem);

module.exports = router;