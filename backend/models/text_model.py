# backend/models/text_model.py
from transformers import AutoTokenizer, AutoModelForSequenceClassification, pipeline
import os

MODEL_NAME = os.getenv("MODEL_TEXT_NAME", "distilbert-base-uncased")

class TextEmotionModel:
    def __init__(self, model_name=None):
        model_name = model_name or MODEL_NAME
        # Note: for prototype we use pipeline for sentiment; replace with multi-label emotion model for real app
        self.tokenizer = AutoTokenizer.from_pretrained(model_name)
        # Use a small pre-trained sentiment head if available; else fallback to pipeline('sentiment-analysis')
        try:
            self.pipe = pipeline("text-classification", model=model_name, tokenizer=self.tokenizer)
        except Exception:
            self.pipe = pipeline("sentiment-analysis", tokenizer=self.tokenizer)

    def analyze(self, text):
        """
        Returns a dict: { 'labels': [{'label':..., 'score':...}], 'risk': bool }
        Very simple risk heuristic: looks for keywords. Replace with trained risk model.
        """
        labels = self.pipe(text[:512])
        # simple keyword-based risk detection (prototype only)
        risk_keywords = ["suicide", "kill myself", "end my life", "hurt myself"]
        lowered = text.lower()
        risk = any(k in lowered for k in risk_keywords)
        return {
            "raw": labels,
            "risk": risk
        }
