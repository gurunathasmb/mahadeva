import React, { useState } from "react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE ?? "http://localhost:8000";

export default function TextInputPanel({ setAnalysis, setRecommendations, affect }) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleAnalyze() {
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/analyze/text`, { text });
      setAnalysis(res.data);
    } catch (err) {
      console.error(err);
      setAnalysis({ error: err?.response?.data || err.message });
    } finally {
      setLoading(false);
    }
  }

  async function handleRecommend() {
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/recommend`, {
        text,
        valence: affect.valence,
        arousal: affect.arousal
      });
      if (res.data.error && res.data.error === "risk_detected") {
        alert("Risk detected — please see resources. App will not provide recommendations for safety.");
        setRecommendations([]);
        setAnalysis(res.data);
      } else {
        setRecommendations(res.data.recommendations || []);
      }
    } catch (err) {
      console.error(err);
      setRecommendations([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card">
      <h3>Say how you feel (or paste devotional text)</h3>
      <textarea rows="6" value={text} onChange={e => setText(e.target.value)} style={{width:"100%"}}/>
      <div style={{marginTop:8, display:"flex", gap:8}}>
        <button onClick={handleAnalyze} disabled={loading}>Analyze</button>
        <button onClick={handleRecommend} disabled={loading}>Recommend Raagas</button>
      </div>
      <div style={{marginTop:8}}>
        <small>On-device affect: valence {affect.valence.toFixed(2)}, arousal {affect.arousal.toFixed(2)}</small>
      </div>
    </div>
  );
}
