// backend/api/upload/uploadController.js
const cloudinary = require('cloudinary').v2;

/**
 * Upload user avatar to Cloudinary and return URL
 */
const uploadAvatar = async (req, res) => {
  try {
    const b64 = Buffer.from(req.file.buffer).toString('base64');
    const dataURI = `data:${req.file.mimetype};base64,${b64}`;

    const result = await cloudinary.uploader.upload(dataURI, {
      folder: 'avatars',
      transformation: [{ width: 200, height: 200, crop: 'fill' }],
    });

    res.json({ avatarUrl: result.secure_url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Upload thất bại' });
  }
};

/**
 * Upload image for community posts
 */
const uploadImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file provided' });

    const b64 = Buffer.from(req.file.buffer).toString('base64');
    const dataURI = `data:${req.file.mimetype};base64,${b64}`;

    const result = await cloudinary.uploader.upload(dataURI, {
      folder: 'community_posts',
      resource_type: 'auto',
    });

    res.json({ imageUrl: result.secure_url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Upload failed' });
  }
};

module.exports = {
  uploadAvatar,
  uploadImage,
};
