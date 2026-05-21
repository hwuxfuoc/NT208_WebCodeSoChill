import api from "./api";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface ChatStreamOptions {
  question: string;
  problemId?: string;
  problemTitle?: string;
  problemDescription?: string;
  problemDifficulty?: string;
  userCode?: string;
  lastSubmissionStatus?: string | null;
  onChunk?: (chunk: string) => void;
  onError?: (error: string) => void;
  onComplete?: () => void;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export async function chatStream(options: ChatStreamOptions): Promise<void> {
  const {
    question,
    problemId,
    problemTitle,
    problemDescription,
    problemDifficulty,
    userCode,
    lastSubmissionStatus,
    onChunk = () => {},
    onError = () => {},
    onComplete = () => {},
  } = options;

  try {
    const response = await fetch(`${API_BASE_URL}/api/ai/chat/stream`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
      },
      body: JSON.stringify({
        question,
        problemId: problemId || null,
        problemTitle: problemTitle || null,
        problemDescription: problemDescription || null,
        problemDifficulty: problemDifficulty || null,
        userCode: userCode || null,
        lastSubmissionStatus: lastSubmissionStatus || null,
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      let message = `HTTP error! status: ${response.status}`;
      try {
        const json = JSON.parse(text);
        if (json.error) message = json.error;
      } catch {}
      throw new Error(message);
    }

    const reader = response.body?.getReader();
    if (!reader) throw new Error("No response body");

    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";

      for (const line of lines) {
        if (line.startsWith("data: ")) {
          const payload = line.slice(6).trim();
          if (payload === "") continue;

          try {
            const json = JSON.parse(payload);
            if (json.done) {
              onComplete();
            } else if (json.error) {
              onError(json.error);
            } else if (json.chunk !== undefined) {
              onChunk(json.chunk);
            }
          } catch (e) {
            console.error("Failed to parse chunk:", e);
          }
        }
      }
    }

    const remaining = decoder.decode();
    if (remaining) buffer += remaining;
    if (buffer.trim().startsWith("data: ")) {
      const payload = buffer.slice(6).trim();
      if (payload && payload !== "[DONE]") {
        try {
          const json = JSON.parse(payload);
          if (json.done) onComplete();
          else if (json.error) onError(json.error);
          else if (json.chunk !== undefined) onChunk(json.chunk);
        } catch {}
      }
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    onError(message);
  }
}
