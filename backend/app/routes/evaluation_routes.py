from fastapi import APIRouter
from app.services.pdf_service import extract_text
from app.services.evaluation_service import evaluate

router = APIRouter()

@router.post("/")
def run(data: dict):
    text = extract_text(data["file_path"])
    return evaluate(text, data["config"])