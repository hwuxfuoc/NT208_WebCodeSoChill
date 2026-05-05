from fastapi import FastAPI
import requests

app = FastAPI()

OLLAMA_URL = "http://localhost:11434/api/generate"

@app.post("/chat")
async def chat(data: dict):
    prompt = data.get("question", "")

    response = requests.post(OLLAMA_URL, json={
        "model": "qwen2.5-coder:7b",
        "prompt": prompt,
        "stream": False
    })

    result = response.json()

    return {
        "answer": result.get("response", "")
    }