from fastapi import APIRouter
from app.services.result_service import generate_pdf

router = APIRouter()

@router.post("/")
def create(data: dict):
    pdf = generate_pdf(data, data["student"])
    return {"pdf": pdf}