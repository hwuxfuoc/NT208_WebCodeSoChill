# ai-service/main.py
from fastapi import FastAPI, HTTPException
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import asyncio
import os
import random
import re
import requests
import json
import uvicorn
from dotenv import load_dotenv

load_dotenv()

from rag import get_relevant_context

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

OLLAMA_URL = os.getenv("OLLAMA_URL", "http://localhost:11434/api/generate")

# TODO: Sau khi fine-tune xong → đổi thành tên model custom
# Ví dụ: MODEL = "codesochill-ai"
# Dự phòng nếu fine-tune thất bại → giữ nguyên model gốc
MODEL = os.getenv("OLLAMA_MODEL", "qwen2.5-coder:7b")


class ChatRequest(BaseModel):
    question: str
    problem_id: Optional[str] = None
    problem_title: Optional[str] = None
    problem_description: Optional[str] = None
    problem_difficulty: Optional[str] = None
    user_code: Optional[str] = None
    last_submission_status: Optional[str] = None


def is_solution_confirmed(status: Optional[str]) -> bool:
    if not status:
        return False

    normalized = status.strip().lower()
    exact_accepts = {"accepted", "ac", "passed", "success", "đã giải đúng"}
    if normalized in exact_accepts:
        return True

    # Chỉ so khớp các từ riêng biệt, tránh nhầm với "incorrect" hoặc "không đúng".
    if any(re.search(rf"\b{re.escape(word)}\b", normalized) for word in ["accepted", "ac", "passed", "success", "correct"]):
        return True

    # Với tiếng Việt, nếu có "đúng" nhưng không nằm trong cụm phủ định như "không đúng" / "chưa đúng".
    if re.search(r"\bđúng\b", normalized) and not re.search(r"\b(?:không|chưa|not|no)\s+đúng\b", normalized):
        return True

    return False


def solved_response() -> str:
    choices = [
        "Bài này đã đúng rồi, bạn có thể tiếp tục với bài khác.",
        "Code hiện tại đã giải đúng, không cần hint thêm.",
        "Bạn đã làm đúng rồi, có thể thử nộp lại để kiểm tra.",
        "Lời giải này đã chính xác, không cần hướng dẫn thêm."
    ]
    return random.choice(choices)


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
- Bắt buộc trả lời bằng tiếng Việt, chỉ dùng tiếng Anh cho tên biến/hàm/keyword lập trình.
- Nếu user đã nộp và kết quả là đúng/accepted, hãy xác nhận bằng một câu tự nhiên tiếng Việt, thân thiện và không cứng nhắc, ví dụ: "Bài này đã đúng rồi...".
- Nếu user_code có sẵn, luôn đọc và phân tích code hiện tại trước khi trả lời. KHÔNG đưa ra kết luận chung chung và KHÔNG nói code đúng nếu bạn chưa kiểm tra kỹ.
- Nếu user_code có sẵn và status không phải accepted hoặc không có status, đừng khen hay nói đã hoàn thành.
- Nếu user_code có sẵn, chỉ mô tả chỗ cần sửa và thay đổi cụ thể. KHÔNG viết lại toàn bộ hàm hoặc chương trình.
- Nếu user_code chưa có, đưa gợi ý logic và cấu trúc chung, không cần code hoàn chỉnh.
- KHÔNG viết code hoàn chỉnh. Nếu cần minh họa, chỉ dùng 1-3 dòng code rất ngắn, chỉ phần cần chỉnh sửa.
- KHÔNG đưa ra ví dụ toàn bộ hàm `solve` hoặc toàn bộ chương trình khi user muốn sửa code.
- KHÔNG bắt đầu bằng các từ thừa hoặc lặp từ như "ĐĐểể", "Hãy Hãy", "cách cách", "trong trong".
- KHÔNG lặp lại chữ cái, từ, cụm từ hoặc câu. Mỗi nội dung chỉ xuất hiện một lần liên tiếp.
- Trả lời chính xác, rõ ràng, vừa đủ. Nếu cần, giải thích chi tiết mỗi bước.
- Giữ nguyên tiếng Anh cho tên biến, tên hàm, keyword lập trình.
- Nếu không chắc: nói không biết thay vì bịa.

--------------------------------------------------------------

{f"Context bài toán:{chr(10)}{problem_info}" if problem_info else ""}

{f"Tài liệu tham khảo liên quan:{chr(10)}{context_docs}" if context_docs else ""}"""


@app.post("/chat")
async def chat(req: ChatRequest):
    """Non-streaming endpoint – dùng khi cần response đơn giản."""
    if is_solution_confirmed(req.last_submission_status):
        return {"answer": solved_response()}

    context_docs = get_relevant_context(req.question, req.problem_id)
    system_prompt = build_system_prompt(req, context_docs)

    full_prompt = f"{system_prompt}\n\nCâu hỏi: {req.question}"

    try:
        response = requests.post(OLLAMA_URL, json={
            "model": MODEL,
            "prompt": full_prompt,
            "stream": False,
            "options": {
                "temperature": 0.0,
                "top_p": 0.7,
                "num_predict": 512,
                "repeat_penalty": 1.3,
                "repeat_last_n": 64,
            },
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
    if is_solution_confirmed(req.last_submission_status):
        async def solved_stream():
            yield f"data: {json.dumps({'token': solved_response()})}\n\n"
            yield "data: [DONE]\n\n"

        return StreamingResponse(solved_stream(), media_type="text/event-stream")

    context_docs = get_relevant_context(req.question, req.problem_id)
    system_prompt = build_system_prompt(req, context_docs)
    full_prompt = f"{system_prompt}\n\nCâu hỏi: {req.question}"

    async def generate():
        loop = asyncio.get_event_loop()

        def _stream():
            """Sync generator chạy trong thread pool để không block event loop."""
            with requests.post(OLLAMA_URL, json={
                "model": MODEL,
                "prompt": full_prompt,
                "stream": True,
                "options": {
                    "temperature": 0.0,
                    "top_p": 0.7,
                    "num_predict": 512,
                    "repeat_penalty": 1.3,
                    "repeat_last_n": 64,
                },
            }, stream=True, timeout=120) as r:
                for line in r.iter_lines():
                    if line:
                        yield line

        try:
            # Chạy blocking I/O trong thread pool executor
            queue: asyncio.Queue = asyncio.Queue()

            def _run_stream():
                try:
                    for line in _stream():
                        asyncio.run_coroutine_threadsafe(queue.put(line), loop)
                except Exception as e:
                    asyncio.run_coroutine_threadsafe(
                        queue.put(f"__error__:{e}"), loop
                    )
                finally:
                    asyncio.run_coroutine_threadsafe(queue.put(None), loop)

            loop.run_in_executor(None, _run_stream)

            while True:
                line = await queue.get()
                if line is None:
                    break
                if isinstance(line, str) and line.startswith("__error__:"):
                    yield f"data: {json.dumps({'error': line[len('__error__:'):]})}\n\n"
                    break
                chunk = json.loads(line)
                token = chunk.get("response", "")
                if token:
                    yield f"data: {json.dumps({'token': token})}\n\n"
                if chunk.get("done"):
                    yield "data: [DONE]\n\n"
                    break
        except Exception as e:
            yield f"data: {json.dumps({'error': str(e)})}\n\n"

    return StreamingResponse(generate(), media_type="text/event-stream")


@app.get("/health")
async def health():
    return {"status": "ok", "model": MODEL}


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)