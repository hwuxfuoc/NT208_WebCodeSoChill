// backend/server.js
const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();
app.use(cors());

app.use('/api/upload', require('./api/upload/uploadRoutes'));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

const bootstrapAdmin = require('./config/bootstrapAdmin');

async function startServer() {
  // Connect to DB first
  await connectDB();
  // Bootstrap admin if configured
  await bootstrapAdmin();

  // Routes
  app.use('/api/auth',          require('./api/auth/authRoutes'));
  app.use('/api/users',         require('./api/users/userRoutes'));
  app.use('/api/problems',      require('./api/problems/problemRoutes'));
  app.use('/api/submissions',   require('./api/submissions/submissionRoutes'));
  app.use('/api/contests',      require('./api/contests/contestRoutes'));
  app.use('/api/community',     require('./api/community/communityRoutes'));
  app.use('/api/notifications', require('./api/notifications/notificationRoutes'));
  app.use('/api/settings',      require('./api/settings/settingRoutes'));
  // Admin routes for privilege management
  app.use('/api/admin', require('./api/admin/adminRoutes'));

  app.get('/', (req, res) => res.send('Server is running...'));

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

startServer();
