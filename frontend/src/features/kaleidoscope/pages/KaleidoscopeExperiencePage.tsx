import type { FC } from "react";
import KaleidoscopeCanvas from "../components/KaleidoscopeCanvas";

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
    title: "分享增长",
    description: "生成动图与封面模板，支持一键分享至社交平台提升传播力。",
  },
];

export const KaleidoscopeExperiencePage: FC = () => (
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
      <KaleidoscopeCanvas />
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

export default KaleidoscopeExperiencePage;
