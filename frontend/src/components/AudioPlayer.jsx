import React from "react";

export default function AudioPlayer({ src }) {
  if (!src) return null;
  return (
    <div>
      <audio controls src={src} style={{width:"100%"}} preload="none" />
    </div>
  );
}
