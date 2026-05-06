// backend/api/admin/adminRoutes.js
const express = require('express');
const router = express.Router();

// Middleware to ensure the requester is an admin
const auth = require('../../middleware/auth');
const adminOnly = require('../../middleware/adminOnly');

// Controller
const { promoteUser } = require('./adminController');

// Route: Promote a user to admin
// POST /api/admin/promote/:userId
router.post('/promote/:userId', auth, adminOnly, promoteUser);

module.exports = router;
