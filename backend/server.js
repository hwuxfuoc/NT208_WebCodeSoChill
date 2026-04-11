const dotenv = require('dotenv');
dotenv.config();  

const express = require('express');
const cors = require('cors');

const connectDB = require('./config/db');
const router = require('./api/auth/authRoutes');

const app = express();

app.use(express.json());
app.use(cors());

connectDB();

app.use('/api/auth', router);

app.get("/", (req, res) => {
  res.send("Server is running...");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});