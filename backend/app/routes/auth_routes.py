from fastapi import APIRouter

router = APIRouter()

@router.post("/register")
def register(data: dict):
    return {"msg": "registered"}

@router.post("/login")
def login():
    return {"msg": "login success"}