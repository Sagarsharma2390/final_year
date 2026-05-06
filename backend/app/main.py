from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes import auth_routes, upload_routes, evaluation_routes, result_routes, subject_routes

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_routes.router, prefix="/auth")
app.include_router(upload_routes.router, prefix="/upload")
app.include_router(evaluation_routes.router, prefix="/evaluate")
app.include_router(result_routes.router, prefix="/results")
app.include_router(subject_routes.router, prefix="/subject")

@app.get("/")
def root():
    return {"message": "Backend running"}