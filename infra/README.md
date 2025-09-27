README.md
# AI Therapy - Raaga Recommender (Prototype)

This repo contains a minimal prototype to demonstrate:
- Frontend React app (Vite)
- FastAPI backend with lightweight text analysis and rule-based recommender
- On-device webcam face detection (TF.js Blazeface) to generate simple affect heuristics

## Quick start (local)

### Backend
1. Go to backend:


cd backend
python -m venv .venv
source .venv/bin/activate # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn app:app --reload --host 0.0.0.0 --port 8000


2. Make sure `catalog.json` points to audio snippets served by frontend public folder (e.g., `/assets/music/yaman_snippet.mp3`).

### Frontend
1. In new terminal:


cd frontend
npm install
npm run dev

2. Open `http://localhost:5173`.

## Notes & Next steps
- This is a **prototype**. Do NOT claim diagnoses or clinical efficacy.
- Replace the heuristic affect extraction with a validated TF.js model or opt for on-device pretrained affect model.
- Replace the simple text pipeline with a multi-label emotion model and a trained risk classifier.
- Privacy: For production, prefer on-device affect analysis and encrypt all PII. Add consent UX prior to capturing webcam data.
- Music licensing: Use only audio you own or licensed for distribution.

## Roadmap ideas
- Fine-tune transformer on devotional + emotion labeled dataset
- Build a cross-modal embedding to match text+affect to rāga audio embeddings
- Add human-in-the-loop clinician escalation