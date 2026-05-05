// backend/api/upload/uploadRoutes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const auth = require('../../middleware/auth');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 2 * 1024 * 1024 } // 2MB
});

router.post('/avatar', auth, upload.single('avatar'), async (req, res) => {
  try {
    const b64 = Buffer.from(req.file.buffer).toString('base64');
    const dataURI = `data:${req.file.mimetype};base64,${b64}`;
    
    const result = await cloudinary.uploader.upload(dataURI, {
      folder: 'avatars',
      transformation: [{ width: 200, height: 200, crop: 'fill' }]
    });

    res.json({ avatarUrl: result.secure_url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Upload thất bại' });
  }
});

module.exports = router;