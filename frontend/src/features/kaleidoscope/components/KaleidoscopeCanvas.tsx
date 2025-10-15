import type { FC } from "react";
import { useKaleidoscopeAnimation } from "../hooks/useKaleidoscopeAnimation";

import "./KaleidoscopeCanvas.css";

export const KaleidoscopeCanvas: FC = () => {
  const canvasRef = useKaleidoscopeAnimation();

  return (
    <canvas
      ref={canvasRef}
      className="kaleidoscope-canvas"
      aria-label="Animated kaleidoscope visual"
      role="img"
    />
  );
};

export default KaleidoscopeCanvas;
