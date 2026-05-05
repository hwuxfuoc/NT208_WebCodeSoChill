// backend/api/notification/notificationRoutes.js
const express = require('express');
const router = express.Router();
const { getNotifications, markAsRead, markAllAsRead, deleteAll } = require('./notificationController');
const auth = require('../../middleware/auth');

// /read-all phải đặt TRƯỚC /:id/read
router.put('/read-all', auth, markAllAsRead);
router.get('/', auth, getNotifications);
router.put('/:id/read', auth, markAsRead);
router.delete('/', auth, deleteAll);

module.exports = router;