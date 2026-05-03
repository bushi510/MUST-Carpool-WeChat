import urllib.request
import json
import sys

def test_api():
    try:
        # Test chat API
        url = 'http://127.0.0.1:5000/api/chat'
        data = json.dumps({"question": "有去高铁站的拼车吗"}).encode('utf-8')
        req = urllib.request.Request(url, data=data, headers={'Content-Type': 'application/json'})
        
        print("Testing backend API (http://127.0.0.1:5000/api/chat) ...")
        with urllib.request.urlopen(req) as response:
            result = json.loads(response.read().decode('utf-8'))
            print("SUCCESS! Response:", result)
    except Exception as e:
        print("FAILED to connect to backend:", str(e))

if __name__ == "__main__":
    test_api()
