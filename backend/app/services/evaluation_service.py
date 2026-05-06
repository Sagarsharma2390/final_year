from app.services.ollama_service import evaluate_ai

def evaluate(text, config):
    ai_output = evaluate_ai(text)

    return {
        "marks": 70,
        "feedback": ai_output
    }