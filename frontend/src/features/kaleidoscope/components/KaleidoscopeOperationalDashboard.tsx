import type { FC } from "react";
import type {
  OperationalInsights,
  OperationalMetric,
  RiskAlert,
  VisualRegressionRun,
} from "../hooks/useOperationalInsights";

import "./KaleidoscopeOperationalDashboard.css";

type KaleidoscopeOperationalDashboardProps = OperationalInsights;

const trendLabelMap: Record<OperationalMetric["trend"], string> = {
  up: "上升",
  stable: "持平",
  down: "下降",
};

const statusLabelMap: Record<VisualRegressionRun["status"], string> = {
  passed: "通过",
  review: "待复核",
  blocked: "阻断",
};

const severityLabelMap: Record<RiskAlert["severity"], string> = {
  low: "低",
  medium: "中",
  high: "高",
};

const getMetricProgress = (metric: OperationalMetric) => {
  if (metric.goal === "max") {
    return Math.min(1, metric.value / metric.target);
  }

  return Math.min(1, metric.target / metric.value);
};

export const KaleidoscopeOperationalDashboard: FC<
  KaleidoscopeOperationalDashboardProps
> = ({ metrics, regressionRuns, alerts, ugc, pulse }) => (
  <section
    className="kaleidoscope-operations"
    aria-labelledby="kaleidoscope-operational-pulse"
  >
    <header className="kaleidoscope-operations__header">
      <div>
        <h2 id="kaleidoscope-operational-pulse">实时运维脉冲</h2>
        <p>
          汇总加载、渲染与风控信号，辅助快速判断体验健康度与回归质量。
        </p>
      </div>
      <dl className="kaleidoscope-operations__summary">
        <div>
          <dt>可用率</dt>
          <dd>{pulse.uptime}</dd>
        </div>
        <div>
          <dt>截图覆盖</dt>
          <dd>{pulse.screenshotCoverage}</dd>
        </div>
        <div>
          <dt>实时 FPS</dt>
          <dd>{pulse.medianFps}fps</dd>
        </div>
        <div>
          <dt>在线设备</dt>
          <dd>{pulse.devicesOnline}</dd>
        </div>
      </dl>
    </header>

    <div className="kaleidoscope-operations__grid">
      <section className="kaleidoscope-operations__card" aria-label="核心指标">
        <header>
          <h3>核心指标</h3>
          <span className="kaleidoscope-operations__badge">目标对齐</span>
        </header>
        <ul className="kaleidoscope-operations__metrics">
          {metrics.map((metric) => {
            const progress = getMetricProgress(metric);
            const progressWidth = `${Math.round(progress * 100)}%`;

            return (
              <li key={metric.id}>
                <div className="kaleidoscope-operations__metric-header">
                  <div>
                    <strong>{metric.label}</strong>
                    <small>{metric.description}</small>
                  </div>
                  <span className="kaleidoscope-operations__metric-value">
                    {metric.value}
                    {metric.unit}
                  </span>
                </div>
                <div className="kaleidoscope-operations__progress" aria-hidden="true">
                  <div style={{ width: progressWidth }} />
                </div>
                <footer>
                  <span>
                    目标 {metric.goal === "max" ? "≥" : "≤"} {metric.target}
                    {metric.unit}
                  </span>
                  <span className={`kaleidoscope-operations__trend is-${metric.trend}`}>
                    {trendLabelMap[metric.trend]}
                  </span>
                </footer>
              </li>
            );
          })}
        </ul>
      </section>

      <section
        className="kaleidoscope-operations__card"
        aria-label="自动化截图比对"
      >
        <header>
          <h3>截图比对流水线</h3>
          <span className="kaleidoscope-operations__badge is-outline">
            最新 3 次
          </span>
        </header>
        <table className="kaleidoscope-operations__table">
          <thead>
            <tr>
              <th scope="col">任务</th>
              <th scope="col">场景</th>
              <th scope="col">差异</th>
              <th scope="col">状态</th>
              <th scope="col">触发</th>
            </tr>
          </thead>
          <tbody>
            {regressionRuns.map((run) => (
              <tr key={run.id}>
                <th scope="row">{run.id}</th>
                <td>{run.scene}</td>
                <td>{run.diffRatio}%</td>
                <td>
                  <span
                    className={`kaleidoscope-operations__status is-${run.status}`}
                  >
                    {statusLabelMap[run.status]}
                  </span>
                </td>
                <td>
                  <span>{run.triggeredBy}</span>
                  <time dateTime={run.timestamp}>{run.timestamp}</time>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="kaleidoscope-operations__card" aria-label="风控雷达">
        <header>
          <h3>风控雷达</h3>
          <span className="kaleidoscope-operations__badge is-soft">
            UGC 待审 {ugc.pending}
          </span>
        </header>
        <dl className="kaleidoscope-operations__ugc">
          <div>
            <dt>已通过</dt>
            <dd>{ugc.approved}</dd>
          </div>
          <div>
            <dt>待审核</dt>
            <dd>{ugc.pending}</dd>
          </div>
          <div>
            <dt>驳回率</dt>
            <dd>{ugc.rejectionRate}%</dd>
          </div>
        </dl>
        <ul className="kaleidoscope-operations__alerts">
          {alerts.map((alert) => (
            <li key={alert.id}>
              <header>
                <span
                  className={`kaleidoscope-operations__severity is-${alert.severity}`}
                >
                  {severityLabelMap[alert.severity]}级
                </span>
                <strong>{alert.title}</strong>
              </header>
              <p>{alert.detail}</p>
              <footer>{alert.owner}</footer>
            </li>
          ))}
        </ul>
      </section>
    </div>
  </section>
);

export default KaleidoscopeOperationalDashboard;

