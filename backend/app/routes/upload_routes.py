from fastapi import APIRouter, UploadFile, File
import os

router = APIRouter()

@router.post("/answer")
async def upload(file: UploadFile = File(...)):
    path = f"uploads/answers/{file.filename}"
    with open(path, "wb") as f:
        f.write(await file.read())
    return {"file_path": path}