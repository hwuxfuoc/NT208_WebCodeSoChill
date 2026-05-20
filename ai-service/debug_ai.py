import requests

for endpoint in [
    ('non-stream', 'http://localhost:8000/chat'),
    ('stream', 'http://localhost:8000/chat/stream'),
]:
    print('---', endpoint[0], endpoint[1])
    payload = {
        'question': 'Hướng dẫn giải bài Longest Palindromic Substring bằng two pointers.',
        'problem_id': '1'
    }
    try:
        if endpoint[0] == 'non-stream':
            r = requests.post(endpoint[1], json=payload, timeout=60)
            print('STATUS', r.status_code)
            print('TEXT', r.text[:2000])
        else:
            r = requests.post(endpoint[1], json=payload, stream=True, timeout=60)
            print('STATUS', r.status_code)
            text = ''
            for line in r.iter_lines():
                if line:
                    s = line.decode('utf-8')
                    print('LINE', s)
                    if s.startswith('data: '):
                        data = s[6:]
                        try:
                            obj = requests.utils.json.loads(data)
                            if obj.get('chunk'):
                                text += obj['chunk']
                            elif obj.get('token'):
                                text += obj['token']
                            elif obj.get('response'):
                                text += obj['response']
                        except Exception:
                            pass
            print('FULL TEXT', text[:2000])
    except Exception as e:
        print('ERROR', repr(e))
