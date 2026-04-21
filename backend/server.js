const dotenv = require('dotenv');
dotenv.config();  

const express = require('express');
const cors = require('cors');

const connectDB = require('./config/db');
const router = require('./api/auth/authRoutes');
const userRoutes = require('./api/user/userRoutes');
const problemRoutes = require('./api/problem/problemRoutes');
const submissionRoutes = require('./api/submission/submissionRoutes');
const contestRoutes = require('./api/contest/contestRoutes');
const communityRoutes = require('./api/community/communityRoutes');
const notificationRoutes = require('./api/notification/notificationRoutes');
const settingRoutes = require('./api/setting/settingRoutes');

const app = express();

app.use(express.json());
app.use(cors());

connectDB();

app.use('/api/auth', router);
app.use('/api/users', userRoutes);
app.use('/api/problems', problemRoutes);
app.use('/api/submissions', submissionRoutes);
app.use('/api/contests', contestRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/settings', settingRoutes);

app.get("/", (req, res) => {
  res.send("Server is running...");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});