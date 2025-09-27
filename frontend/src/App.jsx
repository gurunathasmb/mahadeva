import React, { useState } from "react";
import TextInputPanel from "./components/TextInputPanel";
import WebcamAffect from "./components/WebcamAffect";
import Recommendations from "./components/Recommendations";

export default function App() {
  const [analysis, setAnalysis] = useState(null);
  const [affect, setAffect] = useState({ valence: 0, arousal: 0 });
  const [recommendations, setRecommendations] = useState([]);

  return (
    <div className="container">
      <h1>AI Therapy — Raaga Recommender (Prototype)</h1>
      <div className="grid">
        <div className="column">
          <TextInputPanel setAnalysis={setAnalysis} setRecommendations={setRecommendations} affect={affect}/>
          <WebcamAffect setAffect={setAffect} />
        </div>
        <div className="column">
          <div className="card">
            <h3>Text Analysis</h3>
            <pre>{JSON.stringify(analysis, null, 2)}</pre>
          </div>
          <Recommendations recommendations={recommendations} />
        </div>
      </div>
    </div>
  );
}
