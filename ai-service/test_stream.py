import requests
import json
import sys

data = {
    "question": "Cho minh xin code giai bai Palindrome Number",
    "problem_title": "Palindrome Number",
    "problem_difficulty": "Easy",
    "problem_description": "Given an integer x, return true if x is a palindrome, and false otherwise.",
    "user_code": ""
}

res = requests.post("http://localhost:8000/chat/stream", json=data, stream=True)
for chunk in res.iter_content(chunk_size=None):
    if chunk:
        print(chunk.decode('utf-8'), end='', flush=True)
