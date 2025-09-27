import React, { useEffect, useRef } from "react";
import * as tf from "@tensorflow/tfjs";
import * as blazeface from "@tensorflow-models/blazeface";

export default function WebcamAffect({ setAffect }) {
  const videoRef = useRef(null);
  const modelRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    let mounted = true;
    async function setup() {
      await tf.ready();
      modelRef.current = await blazeface.load();
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
          tick();
        }
      } catch (err) {
        console.warn("webcam not available", err);
      }
    }

    async function tick() {
      if (!mounted) return;
      if (videoRef.current && modelRef.current) {
        const predictions = await modelRef.current.estimateFaces(videoRef.current, false);
        if (predictions && predictions.length > 0) {
          // crude heuristic from face box: bigger mouth area -> higher arousal, smile detection -> positive valence
          const p = predictions[0];
          const start = p.topLeft, end = p.bottomRight;
          const w = end[0] - start[0], h = end[1] - start[1];
          // placeholder heuristics:
          const arousal = Math.min(1, Math.max(0, (h - 150) / 200)); // tune empirically
          const valence = p.probability && p.probability[0] > 0.95 ? 0.3 : 0; // dummy
          setAffect({ valence, arousal });
        }
      }
      rafRef.current = requestAnimationFrame(tick);
    }

    setup();
    return () => { mounted = false; if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, []);

  return (
    <div className="card">
      <h3>Webcam (on-device affect)</h3>
      <video ref={videoRef} width="320" height="240" autoPlay muted playsInline style={{borderRadius:8, background:"#000"}} />
      <div style={{marginTop:8, fontSize:"0.9rem"}}>Video stays on device; frames are not uploaded in prototype.</div>
    </div>
  );
}
