# backend/app.py
import os
from fastapi import FastAPI, HTTPException, UploadFile, File
from pydantic import BaseModel
from typing import Optional
from fastapi.middleware.cors import CORSMiddleware
from models.text_model import TextEmotionModel
from models.recommender import recommend
from utils.safety import check_risk

app = FastAPI(title="AI Therapy Raaga - Prototype API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # lock this down in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

text_model = TextEmotionModel()

class TextAnalyzeRequest(BaseModel):
    text: str

class RecommendRequest(BaseModel):
    text: Optional[str] = None
    valence: Optional[float] = 0.0
    arousal: Optional[float] = 0.0

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/analyze/text")
def analyze_text(req: TextAnalyzeRequest):
    if not req.text:
        raise HTTPException(status_code=400, detail="text required")
    out = text_model.analyze(req.text)
    safety = check_risk(out)
    return {"analysis": out, "safety": safety}

@app.post("/recommend")
def recommend_route(req: RecommendRequest):
    # Use text model if provided
    labels = []
    if req.text:
        t = text_model.analyze(req.text)
        labels = t.get("raw", [])
        # if risk escalate
        safety = check_risk(t)
        if safety.get("escalate"):
            return {"error": "risk_detected", "safety": safety}
    recs = recommend(labels, valence=req.valence or 0.0, arousal=req.arousal or 0.0, top_k=5)
    return {"recommendations": recs}

@app.post("/upload/photo")
async def upload_photo(file: UploadFile = File(...)):
    # Prototype: accept and drop file (we recommend doing frontend on-device TF.js to avoid uploading image)
    contents = await file.read()
    # Optionally implement server-side FER here
    return {"message": "received", "size": len(contents)}
