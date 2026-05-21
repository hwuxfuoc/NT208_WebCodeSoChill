// backend/app.js
// File này tách logic Express ra khỏi server.js để có thể import trong tests
// mà không trigger listen() / kết nối DB thật

const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Đăng ký routes
app.use('/api/upload', require('./api/upload/uploadRoutes'));
app.use('/api/auth', require('./api/auth/authRoutes'));
app.use('/api/users', require('./api/users/userRoutes'));
app.use('/api/problems', require('./api/problems/problemRoutes'));
app.use('/api/submissions', require('./api/submissions/submissionRoutes'));
app.use('/api/contests', require('./api/contests/contestRoutes'));
app.use('/api/stats', require('./api/stats/statsRoutes'));
app.use('/api/community', require('./api/community/communityRoutes'));
app.use('/api/notifications', require('./api/notifications/notificationRoutes'));
app.use('/api/messages', require('./api/messages/messageRoutes'));
app.use('/api/settings', require('./api/settings/settingRoutes'));
app.use('/api/admin', require('./api/admin/adminRoutes'));
app.use('/api/ai', require('./api/ai/aiRoutes'));

app.get('/', (req, res) => res.send('Server is running...'));

module.exports = app;
