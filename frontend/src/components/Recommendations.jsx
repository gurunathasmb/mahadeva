import React from "react";
import AudioPlayer from "./AudioPlayer";

export default function Recommendations({ recommendations = [] }) {
  if (!recommendations || recommendations.length === 0) {
    return (
      <div className="card">
        <h3>Recommendations</h3>
        <p>No recommendations yet. Try analyzing text & webcam affect.</p>
      </div>
    );
  }
  return (
    <div className="card">
      <h3>Recommendations</h3>
      {recommendations.map(rec => (
        <div key={rec.id} style={{marginBottom:12}}>
          <strong>{rec.name}</strong>
          <div>{rec.notes}</div>
          <div style={{marginTop:6}}>
            <AudioPlayer src={rec.snippet} />
          </div>
        </div>
      ))}
    </div>
  );
}
