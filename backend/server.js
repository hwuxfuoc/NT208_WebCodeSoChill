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
app.use('/api/users',         require('./api/users/userRoutes'));
app.use('/api/problems',      require('./api/problems/problemRoutes'));
app.use('/api/submissions',   require('./api/submissions/submissionRoutes'));
app.use('/api/contests',      require('./api/contests/contestRoutes'));
app.use('/api/community',     require('./api/community/communityRoutes'));
app.use('/api/notifications', require('./api/notifications/notificationRoutes'));
app.use('/api/settings',      require('./api/settings/settingRoutes'));

app.get('/', (req, res) => res.send('Server is running...'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));