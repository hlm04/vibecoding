import type { FC } from "react";
import KaleidoscopeCanvas from "../components/KaleidoscopeCanvas";
import KaleidoscopeControlPanel from "../components/KaleidoscopeControlPanel";
import { useKaleidoscopeControls } from "../hooks/useKaleidoscopeControls";

import "./KaleidoscopeExperiencePage.css";

const iterationHighlights = [
  {
    title: "交互反馈",
    description: "响应滑动与倾斜手势，动态调整画面对称轴与配色节奏。",
  },
  {
    title: "音频驱动",
    description: "结合实时频谱，映射粒子密度与亮度，营造沉浸式视觉音乐。",
  },
  {
    title: "系统稳态",
    description: "引入帧率监控与粒子池调节策略，保障移动端 45fps 以上体验。",
  },
  {
    title: "分享增长",
    description: "生成动图与封面模板，支持一键分享至社交平台提升传播力。",
  },
];

const roadmap = [
  {
    week: "Sprint 02",
    focus: "陀螺仪桥接",
    detail: "完成端能力兼容性验证，接入低延迟姿态数据并补充容错策略。",
  },
  {
    week: "Sprint 03",
    focus: "音画联动",
    detail: "搭建 WebAudio 频谱服务，输出节奏特征驱动镜像、光晕和粒子密度。",
  },
  {
    week: "Sprint 04",
    focus: "增长闭环",
    detail: "上线一键导出短视频模板及分享跟踪指标，完成私域拉新试验。",
  },
];

export const KaleidoscopeExperiencePage: FC = () => {
  const {
    settings,
    sliceCount,
    formatted,
    interactionProps,
    reset,
  } = useKaleidoscopeControls();

  return (
    <main className="kaleidoscope-page">
      <header className="kaleidoscope-page__header">
        <span className="kaleidoscope-page__tag">Sprint 01</span>
        <h1 className="kaleidoscope-page__title">Kaleidoscope 矩阵体验</h1>
        <p className="kaleidoscope-page__subtitle">
          以 WebGL 打造实时变幻的万花筒舞台，为 H5 活动注入可感知的科技感。
        </p>
      </header>

      <section className="kaleidoscope-page__visual" aria-labelledby="kaleidoscope-visual">
        <h2 id="kaleidoscope-visual" className="visually-hidden">
          实时动画展示
        </h2>
        <div className="kaleidoscope-page__lab">
          <div className="kaleidoscope-page__lab-stage" {...interactionProps}>
            <KaleidoscopeCanvas settings={settings} />
            <div className="kaleidoscope-page__lab-overlay" aria-hidden="true">
              <span>拖动、按住或使用方向键探索不同维度</span>
            </div>
          </div>
          <KaleidoscopeControlPanel
            sliceCount={sliceCount}
            rotationSpeedLabel={formatted.rotation}
            hueVarianceLabel={formatted.hueVariance}
            pulseLabel={formatted.pulse}
            onReset={reset}
          />
        </div>
      </section>

      <section className="kaleidoscope-page__highlights" aria-labelledby="kaleidoscope-highlights">
        <h2 id="kaleidoscope-highlights">本周迭代看点</h2>
        <ul>
          {iterationHighlights.map((highlight) => (
            <li key={highlight.title}>
              <h3>{highlight.title}</h3>
              <p>{highlight.description}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="kaleidoscope-page__roadmap" aria-labelledby="kaleidoscope-roadmap">
        <h2 id="kaleidoscope-roadmap">后续冲刺路线</h2>
        <ol>
          {roadmap.map((item) => (
            <li key={item.week}>
              <header>
                <span>{item.week}</span>
                <strong>{item.focus}</strong>
              </header>
              <p>{item.detail}</p>
            </li>
          ))}
        </ol>
      </section>

      <footer className="kaleidoscope-page__footer">
        <button type="button" className="kaleidoscope-page__cta">
          预约内测体验
        </button>
        <p className="kaleidoscope-page__hint">
          支持移动端触摸体验，桌面端可使用鼠标与键盘探索更多效果。
        </p>
      </footer>
    </main>
  );
};

export default KaleidoscopeExperiencePage;
