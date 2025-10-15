import { useMemo } from "react";

export type Trend = "up" | "stable" | "down";

export type MetricGoal = "max" | "min";

export type OperationalMetric = {
  id: string;
  label: string;
  value: number;
  unit: string;
  target: number;
  goal: MetricGoal;
  trend: Trend;
  description: string;
};

export type VisualRegressionRun = {
  id: string;
  scene: string;
  diffRatio: number;
  status: "passed" | "review" | "blocked";
  triggeredBy: string;
  timestamp: string;
};

export type RiskAlert = {
  id: string;
  severity: "low" | "medium" | "high";
  title: string;
  detail: string;
  owner: string;
};

export type UgcSnapshot = {
  approved: number;
  pending: number;
  rejectionRate: number;
};

export type OperationalPulse = {
  uptime: string;
  screenshotCoverage: string;
  medianFps: number;
  devicesOnline: number;
};

export type OperationalInsights = {
  metrics: OperationalMetric[];
  regressionRuns: VisualRegressionRun[];
  alerts: RiskAlert[];
  ugc: UgcSnapshot;
  pulse: OperationalPulse;
};

export const useOperationalInsights = (): OperationalInsights =>
  useMemo(
    () => ({
      metrics: [
        {
          id: "load-success",
          label: "加载成功率",
          value: 99.62,
          unit: "%",
          target: 99.5,
          goal: "max",
          trend: "up",
          description: "目标 ≥ 99.5%，实时监控错误率波动。",
        },
        {
          id: "first-load",
          label: "首屏 P95",
          value: 3.2,
          unit: "s",
          target: 3.5,
          goal: "min",
          trend: "stable",
          description: "目标 < 3.5s，持续跟踪脚本执行时间。",
        },
        {
          id: "fps",
          label: "FPS P90",
          value: 47,
          unit: "fps",
          target: 45,
          goal: "max",
          trend: "up",
          description: "目标 ≥ 45fps，落盘粒子池调度数据。",
        },
        {
          id: "ugc",
          label: "UGC 审核延时 P90",
          value: 1.7,
          unit: "min",
          target: 2,
          goal: "min",
          trend: "down",
          description: "目标 < 2 分钟，命中告警阈值后触发加速流程。",
        },
      ],
      regressionRuns: [
        {
          id: "VR-2410",
          scene: "Nebula Hub",
          diffRatio: 0.7,
          status: "passed",
          triggeredBy: "CI #6812",
          timestamp: "12:40",
        },
        {
          id: "VR-2409",
          scene: "Aurora Tunnel",
          diffRatio: 3.1,
          status: "review",
          triggeredBy: "CI #6805",
          timestamp: "10:15",
        },
        {
          id: "VR-2408",
          scene: "Ocean Prism",
          diffRatio: 6.4,
          status: "blocked",
          triggeredBy: "CI #6792",
          timestamp: "08:52",
        },
      ],
      alerts: [
        {
          id: "alert-01",
          severity: "medium",
          title: "FPS 波动",
          detail: "低端设备批次在 60 分钟压测中跌至 41fps。",
          owner: "性能监控",
        },
        {
          id: "alert-02",
          severity: "high",
          title: "截图差异待复核",
          detail: "Aurora Tunnel 场景出现 3.1% 像素偏差，等待设计确认。",
          owner: "视觉质检",
        },
        {
          id: "alert-03",
          severity: "low",
          title: "UGC 审核积压",
          detail: "待审队列 8 条，预计 12 分钟内消化。",
          owner: "运营审核",
        },
      ],
      ugc: {
        approved: 96,
        pending: 8,
        rejectionRate: 1.8,
      },
      pulse: {
        uptime: "99.97%",
        screenshotCoverage: "96%",
        medianFps: 48,
        devicesOnline: 312,
      },
    }),
    [],
  );

