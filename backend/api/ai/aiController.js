const axios = require("axios");

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || "http://localhost:8000";

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
    console.error("[chat]", err.response?.data || err.message);
    if (err.code === "ECONNREFUSED")
      return res.status(503).json({ error: "AI service đang offline" });
    if (err.code === "ECONNABORTED")
      return res.status(504).json({ error: "AI service timeout" });
    return res.status(500).json({ error: "Lỗi khi gọi AI" });
  }
};

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

    let lineBuffer = "";

    aiRes.data.on("data", (chunk) => {
      lineBuffer += chunk.toString();
      const lines = lineBuffer.split("\n");
      lineBuffer = lines.pop() || "";

      for (const line of lines) {
        if (!line.startsWith("data: ")) continue;

        const payload = line.slice(6).trim();
        if (!payload) continue;

        if (payload === "[DONE]") {
          res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
          res.end();
          return;
        }

        try {
          const parsed = JSON.parse(payload);

          if (parsed.done) {
            res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
            res.end();
            return;
          }

          if (parsed.error) {
            res.write(`data: ${JSON.stringify({ error: parsed.error })}\n\n`);
            continue;
          }

          const textChunk = parsed.chunk ?? parsed.token ?? parsed.response;
          if (textChunk) {
            res.write(`data: ${JSON.stringify({ chunk: textChunk })}\n\n`);
          }
        } catch (parseErr) {
          console.warn("[chatStream] Cannot parse chunk:", payload?.slice(0, 80));
        }
      }
    });

    aiRes.data.on("error", (err) => {
      res.write(`data: ${JSON.stringify({ error: err.message })}\n\n`);
      res.end();
    });
  } catch (err) {
    const message = err.response?.data || err.message || String(err);
    console.error("[chatStream]", message, err.code);

    const isRefused =
      err.code === "ECONNREFUSED" ||
      String(err.message).includes("ECONNREFUSED");
    const isTimeout =
      err.code === "ECONNABORTED" || String(err.message).includes("timeout");

    if (isRefused) {
      res.write(
        `data: ${JSON.stringify({ error: "AI service đang offline" })}\n\n`
      );
    } else if (isTimeout) {
      res.write(
        `data: ${JSON.stringify({ error: "AI service timeout" })}\n\n`
      );
    } else {
      res.write(
        `data: ${JSON.stringify({ error: "Lỗi khi gọi AI service" })}\n\n`
      );
    }
    res.end();
  }
};

module.exports = { chat, chatStream };