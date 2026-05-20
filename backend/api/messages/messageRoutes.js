const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { getConversations, getMessages, createConversation, sendMessage } = require('./messageController');

router.post('/', auth, createConversation);
router.get('/conversations', auth, getConversations);
router.get('/:conversationId', auth, getMessages);
router.post('/:conversationId', auth, sendMessage);

module.exports = router;
