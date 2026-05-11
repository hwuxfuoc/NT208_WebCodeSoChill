// backend/api/ai/aiController.js
const axios = require("axios");

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || "http://localhost:8000";

// ── POST /api/ai/chat – Non-streaming ────────────────────────────────────────
const chat = async (req, res) => {
  const {
    question,
    problemId,
    problemTitle,
    problemDescription,
    problemDifficulty,
    userCode,
    lastSubmissionStatus,
  } = req.body;

  if (!question?.trim()) {
    return res.status(400).json({ error: "question không được để trống" });
  }

  try {
    const aiRes = await axios.post(
      `${AI_SERVICE_URL}/chat`,
      {
        question,
        problem_id: problemId || null,
        problem_title: problemTitle || null,
        problem_description: problemDescription || null,
        problem_difficulty: problemDifficulty || null,
        user_code: userCode || null,
        last_submission_status: lastSubmissionStatus || null,
      },
      { timeout: 120_000 }
    );

    return res.json({ answer: aiRes.data.answer });
  } catch (err) {
    console.error("[chat]", err.message);
    if (err.code === "ECONNREFUSED")
      return res.status(503).json({ error: "AI service đang offline" });
    if (err.code === "ECONNABORTED")
      return res.status(504).json({ error: "AI service timeout" });
    return res.status(500).json({ error: "Lỗi khi gọi AI" });
  }
};

// ── POST /api/ai/chat/stream – Streaming (SSE) ───────────────────────────────
const chatStream = async (req, res) => {
  const {
    question,
    problemId,
    problemTitle,
    problemDescription,
    problemDifficulty,
    userCode,
    lastSubmissionStatus,
  } = req.body;

  if (!question?.trim()) {
    return res.status(400).json({ error: "question không được để trống" });
  }

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  try {
    const aiRes = await axios.post(
      `${AI_SERVICE_URL}/chat/stream`,
      {
        question,
        problem_id: problemId || null,
        problem_title: problemTitle || null,
        problem_description: problemDescription || null,
        problem_difficulty: problemDifficulty || null,
        user_code: userCode || null,
        last_submission_status: lastSubmissionStatus || null,
      },
      { responseType: "stream", timeout: 120_000 }
    );

    aiRes.data.on("data", (chunk) => {
      const lines = chunk.toString().split("\n");
      for (const line of lines) {
        if (line.startsWith("data: ")) {
          const payload = line.slice(6).trim();
          if (payload === "[DONE]") {
            res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
            res.end();
          } else {
            res.write(`data: ${payload}\n\n`);
          }
        }
      }
    });

    aiRes.data.on("error", (err) => {
      res.write(`data: ${JSON.stringify({ error: err.message })}\n\n`);
      res.end();
    });
  } catch (err) {
    console.error("[chatStream]", err.message);
    res.write(`data: ${JSON.stringify({ error: "Lỗi khi gọi AI service" })}\n\n`);
    res.end();
  }
};

module.exports = { chat, chatStream };