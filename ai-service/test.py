import requests
import json

data = {
    "question": "Cho minh xin code giai bai Palindrome Number",
    "problem_title": "Palindrome Number",
    "problem_difficulty": "Easy",
    "problem_description": "Given an integer x, return true if x is a palindrome, and false otherwise."
}

res = requests.post("http://localhost:8000/chat", json=data)
print(json.dumps(res.json(), indent=2, ensure_ascii=False))
