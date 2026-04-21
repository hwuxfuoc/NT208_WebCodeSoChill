// backend/server.js
const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();
app.use(express.json());
app.use(cors());

connectDB();

// Routes
app.use('/api/auth',          require('./api/auth/authRoutes'));
app.use('/api/users',         require('./api/user/userRoutes'));
app.use('/api/problems',      require('./api/problem/problemRoutes'));
app.use('/api/submissions',   require('./api/submission/submissionRoutes'));
app.use('/api/contests',      require('./api/contest/contestRoutes'));
app.use('/api/community',     require('./api/community/communityRoutes'));
app.use('/api/notifications', require('./api/notification/notificationRoutes'));
app.use('/api/settings',      require('./api/setting/settingRoutes'));

app.get('/', (req, res) => res.send('Server is running...'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));