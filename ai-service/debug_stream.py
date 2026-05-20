import requests

url = 'http://localhost:8000/chat/stream'
payload = {
    'question': 'Làm sao giải bài Longest Palindromic Substring bằng two pointers?',
    'problem_id': '1'
}

try:
    r = requests.post(url, json=payload, stream=True, timeout=60)
    print('status', r.status_code)
    count = 0
    for line in r.iter_lines():
        if line:
            print('LINE', line.decode('utf-8'))
            count += 1
            if count >= 20:
                break
except Exception as e:
    print('ERROR', repr(e))
