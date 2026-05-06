from fastapi import APIRouter

router = APIRouter()

current_subject = {}

@router.post("/")
def set_subject(data: dict):
    global current_subject
    current_subject = data
    return {"msg": "saved"}

@router.get("/")
def get_subject():
    return current_subject