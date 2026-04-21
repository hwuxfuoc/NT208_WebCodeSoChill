// backend/api/community/communityRoutes.js
const express = require('express');
const router = express.Router();
const { getPosts, createPost, likePost, getComments, addComment } = require('./communityController');
const auth = require('../../middleware/auth');

router.get('/posts', getPosts);
router.post('/posts', auth, createPost);
router.post('/posts/:id/like', auth, likePost);
router.get('/posts/:id/comments', getComments);
router.post('/posts/:id/comments', auth, addComment);

module.exports = router;