import requests

def evaluate_ai(text):
    res = requests.post("http://localhost:11434/api/generate", json={
        "model": "llama3",
        "prompt": f"Give marks out of 100:\n{text}",
        "stream": False
    })
    return res.json()["response"]