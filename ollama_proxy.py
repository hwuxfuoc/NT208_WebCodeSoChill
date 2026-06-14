"""
Proxy đơn giản: nhận request từ ngrok → forward sang Ollama localhost
Chạy: python ollama_proxy.py
Sau đó expose cổng 12000 qua ngrok: ngrok http 12000
"""
from fastapi import FastAPI, Request
from fastapi.responses import StreamingResponse, JSONResponse
import httpx
import uvicorn

app = FastAPI()
OLLAMA_BASE = "http://localhost:11434"

@app.api_route("/{path:path}", methods=["GET", "POST", "PUT", "DELETE", "HEAD", "OPTIONS"])
async def proxy(path: str, request: Request):
    body = await request.body()
    # Lọc bỏ các header không cần thiết, force Host về localhost
    forward_headers = {
        k: v for k, v in request.headers.items()
        if k.lower() not in ("host", "ngrok-skip-browser-warning", "connection", "transfer-encoding")
    }

    async with httpx.AsyncClient(timeout=180) as client:
        resp = await client.request(
            method=request.method,
            url=f"{OLLAMA_BASE}/{path}",
            headers=forward_headers,
            content=body,
        )

    # Nếu là streaming response
    if "text/event-stream" in resp.headers.get("content-type", "") or resp.headers.get("transfer-encoding") == "chunked":
        async def stream_gen():
            async for chunk in resp.aiter_bytes():
                yield chunk
        return StreamingResponse(
            stream_gen(),
            status_code=resp.status_code,
            media_type=resp.headers.get("content-type", "application/json"),
        )

    return JSONResponse(
        content=resp.json() if resp.headers.get("content-type", "").startswith("application/json") else resp.text,
        status_code=resp.status_code,
    )

if __name__ == "__main__":
    print("Ollama Proxy dang chay tai http://localhost:12000")
    print("Expose qua ngrok: ngrok http 12000")
    uvicorn.run(app, host="0.0.0.0", port=12000)
