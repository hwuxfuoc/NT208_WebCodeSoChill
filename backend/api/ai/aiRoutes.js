// backend/api/ai/aiRoutes.js
const express = require("express");
const router = express.Router();
const { chat, chatStream } = require("./aiController");

router.post("/chat", chat);
router.post("/chat/stream", chatStream);

module.exports = router;