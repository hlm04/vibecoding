import type { FC } from "react";

import "./KaleidoscopeControlPanel.css";

type KaleidoscopeControlPanelProps = {
  sliceCount: number;
  rotationSpeedLabel: string;
  hueVarianceLabel: string;
  pulseLabel: string;
  onReset: () => void;
};

export const KaleidoscopeControlPanel: FC<KaleidoscopeControlPanelProps> = ({
  sliceCount,
  rotationSpeedLabel,
  hueVarianceLabel,
  pulseLabel,
  onReset,
}) => (
  <section className="kaleidoscope-controls" aria-label="互动控制面板">
    <header className="kaleidoscope-controls__header">
      <h3>互动参数</h3>
      <button type="button" onClick={onReset} className="kaleidoscope-controls__reset">
        重置 (R)
      </button>
    </header>

    <dl className="kaleidoscope-controls__grid">
      <div>
        <dt>镜像分片</dt>
        <dd>{sliceCount}</dd>
      </div>
      <div>
        <dt>色散幅度</dt>
        <dd>{hueVarianceLabel}</dd>
      </div>
      <div>
        <dt>旋转速度</dt>
        <dd>{rotationSpeedLabel}</dd>
      </div>
      <div>
        <dt>脉冲能量</dt>
        <dd>{pulseLabel}</dd>
      </div>
    </dl>

    <p className="kaleidoscope-controls__hint">
      拖动画布调整色彩与速度，方向键 ±1 分片，双指或鼠标中键按压可带来更强的能量回响。
    </p>
  </section>
);

export default KaleidoscopeControlPanel;
