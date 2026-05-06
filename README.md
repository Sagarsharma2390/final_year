# 🤖 AI-Based Smart Evaluation System

An AI-powered web application designed to automate the evaluation of student answer scripts using Artificial Intelligence, PDF text extraction, and face-recognition-based authentication.

---

## 📌 Project Overview

The AI-Based Smart Evaluation System helps educational institutions reduce manual evaluation workload by automatically assessing student answer scripts uploaded in PDF format.

The system uses:
- React + TypeScript frontend
- FastAPI backend
- Ollama AI integration
- SQL database
- Face recognition authentication

---

# 🚀 Features

## 👨‍🏫 Teacher Authentication
- Teacher Registration
- Login with Email & Password
- Face Recognition Verification

---

## 📄 Answer Script Processing
- Upload Answer Templates
- Upload Student Answer Scripts (PDF)
- Automatic PDF Text Extraction

---

## 🤖 AI Evaluation
- AI-based answer evaluation using Ollama API
- Section-wise marking system
- Configurable marks distribution

---

## 📊 Result Management
- View evaluation results
- Dashboard analytics
- Download result sheet as PDF

---

# 🛠️ Technologies Used

## Frontend
- React (Vite)
- TypeScript
- Tailwind CSS

## Backend
- FastAPI
- Python
- Uvicorn

## Database
- SQLite / MySQL

## AI Integration
- Ollama API

## PDF Processing
- PyMuPDF
- pdfplumber

## Authentication
- Face Recognition

---

# 📂 Project Structure

## Frontend

frontend/
│
├── src/
│ ├── app/
│ │ ├── pages/
│ │ ├── components/
│ │ └── context/
│ │
│ ├── services/
│ │ └── api.ts
│ │
│ └── main.tsx


---

## Backend

backend/
│
├── app/
│ ├── routes/
│ ├── services/
│ ├── models/
│ ├── database/
│ ├── schemas/
│ └── main.py
│
├── uploads/
│ ├── answers/
│ └── results/
│
├── requirements.txt
└── .env


---

# ⚙️ Installation & Setup

## 1️⃣ Clone Repository

```bash
git clone https://github.com/your-username/ai-smart-evaluation-system.git
cd ai-smart-evaluation-system