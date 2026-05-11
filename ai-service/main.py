# ai-service/main.py
from fastapi import FastAPI, HTTPException
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import requests
import json

from rag import get_relevant_context

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

OLLAMA_URL = "http://localhost:11434/api/generate"

# TODO: Sau khi fine-tune xong → đổi thành tên model custom
# Ví dụ: MODEL = "codesochill-ai"
# Dự phòng nếu fine-tune thất bại → giữ nguyên model gốc
MODEL = "qwen2.5-coder:7b"


class ChatRequest(BaseModel):
    question: str
    problem_id: Optional[str] = None
    problem_title: Optional[str] = None
    problem_description: Optional[str] = None
    problem_difficulty: Optional[str] = None
    user_code: Optional[str] = None
    last_submission_status: Optional[str] = None


def build_system_prompt(req: ChatRequest, context_docs: str) -> str:
    problem_info = ""
    if req.problem_title:
        problem_info = f"""
Bài đang làm: {req.problem_title} ({req.problem_difficulty or 'Unknown'})
Mô tả bài: {req.problem_description or 'Không có'}
Code hiện tại của user: {req.user_code or 'Chưa có'}
Kết quả nộp gần nhất: {req.last_submission_status or 'Chưa nộp'}
""".strip()

    return f"""Bạn là AI hỗ trợ học lập trình cho sinh viên trên nền tảng CodeSoChill.
Nhiệm vụ của bạn là HƯỚNG DẪN, không phải làm bài thay.

Nguyên tắc bắt buộc:
- KHÔNG đưa code hoàn chỉnh giải bài (chỉ được đưa snippet minh họa concept)
- Chỉ gợi ý hướng tiếp cận, giải thích concept
- Nếu user hỏi code thẳng: từ chối nhẹ nhàng và gợi ý thay thế
- Trả lời ngắn gọn, rõ ràng, dùng tiếng Việt
- Giữ nguyên tiếng Anh cho tên biến, tên hàm, keyword lập trình
- Nếu không chắc: nói không biết thay vì bịa

{f"Context bài toán:{chr(10)}{problem_info}" if problem_info else ""}

{f"Tài liệu tham khảo liên quan:{chr(10)}{context_docs}" if context_docs else ""}"""


@app.post("/chat")
async def chat(req: ChatRequest):
    """Non-streaming endpoint – dùng khi cần response đơn giản."""
    context_docs = get_relevant_context(req.question, req.problem_id)
    system_prompt = build_system_prompt(req, context_docs)

    full_prompt = f"{system_prompt}\n\nCâu hỏi: {req.question}"

    try:
        response = requests.post(OLLAMA_URL, json={
            "model": MODEL,
            "prompt": full_prompt,
            "stream": False,
        }, timeout=120)
        response.raise_for_status()
        result = response.json()
        return {"answer": result.get("response", "")}
    except requests.exceptions.Timeout:
        raise HTTPException(status_code=504, detail="Model timeout – thử lại sau")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/chat/stream")
async def chat_stream(req: ChatRequest):
    """Streaming endpoint – dùng cho frontend để hiện chữ dần."""
    context_docs = get_relevant_context(req.question, req.problem_id)
    system_prompt = build_system_prompt(req, context_docs)
    full_prompt = f"{system_prompt}\n\nCâu hỏi: {req.question}"

    def generate():
        try:
            with requests.post(OLLAMA_URL, json={
                "model": MODEL,
                "prompt": full_prompt,
                "stream": True,
            }, stream=True, timeout=120) as r:
                for line in r.iter_lines():
                    if line:
                        chunk = json.loads(line)
                        token = chunk.get("response", "")
                        if token:
                            # Server-Sent Events format
                            yield f"data: {json.dumps({'token': token})}\n\n"
                        if chunk.get("done"):
                            yield "data: [DONE]\n\n"
        except Exception as e:
            yield f"data: {json.dumps({'error': str(e)})}\n\n"

    return StreamingResponse(generate(), media_type="text/event-stream")


@app.get("/health")
async def health():
    return {"status": "ok", "model": MODEL}