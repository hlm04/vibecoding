import type { FC } from "react";
import type { KaleidoscopeSettings } from "../hooks/useKaleidoscopeAnimation";
import { useKaleidoscopeAnimation } from "../hooks/useKaleidoscopeAnimation";

import "./KaleidoscopeCanvas.css";

type KaleidoscopeCanvasProps = {
  settings: KaleidoscopeSettings;
};

export const KaleidoscopeCanvas: FC<KaleidoscopeCanvasProps> = ({ settings }) => {
  const canvasRef = useKaleidoscopeAnimation(settings);

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
