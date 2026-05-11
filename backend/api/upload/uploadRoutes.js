// backend/api/upload/uploadRoutes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const auth = require('../../middleware/auth');
const { uploadAvatar, uploadImage } = require('./uploadController');
// Cloudinary configuration (moved here for clarity, could be centralized)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 2 * 1024 * 1024 } // 2MB
});

router.post('/avatar', auth, upload.single('avatar'), uploadAvatar);
router.post('/image', auth, upload.single('image'), uploadImage);

module.exports = router;
