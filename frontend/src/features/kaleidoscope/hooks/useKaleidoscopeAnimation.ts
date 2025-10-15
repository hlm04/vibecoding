import { useEffect, useRef } from "react";

export type KaleidoscopeSettings = {
  sliceCount: number;
  baseHue: number;
  hueVariance: number;
  rotationSpeed: number;
  pulseStrength: number;
};

export const DEFAULT_KALEIDOSCOPE_SETTINGS: KaleidoscopeSettings = {
  sliceCount: 12,
  baseHue: 200,
  hueVariance: 120,
  rotationSpeed: 0.0004,
  pulseStrength: 0.12,
};

const RADIUS_SCALE = 0.82;
const toRadians = (angle: number) => (angle * Math.PI) / 180;

const setCanvasSize = (
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
) => {
  const { devicePixelRatio = 1 } = window;
  const { clientWidth, clientHeight } = canvas;

  canvas.width = clientWidth * devicePixelRatio;
  canvas.height = clientHeight * devicePixelRatio;
  ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
};

const drawSlice = (
  ctx: CanvasRenderingContext2D,
  sliceIndex: number,
  time: number,
  settings: KaleidoscopeSettings,
) => {
  const { canvas } = ctx;
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.min(width, height) * RADIUS_SCALE;

  const hueShift =
    ((sliceIndex / settings.sliceCount) * settings.hueVariance + time / 20) % 360;
  const gradient = ctx.createLinearGradient(-radius, -radius, radius, radius);
  gradient.addColorStop(
    0,
    `hsl(${(settings.baseHue + hueShift) % 360}, 90%, 60%)`,
  );
  gradient.addColorStop(
    0.5,
    `hsl(${(settings.baseHue + hueShift + 30) % 360}, 80%, 55%)`,
  );
  gradient.addColorStop(
    1,
    `hsl(${(settings.baseHue + hueShift + 60) % 360}, 75%, 50%)`,
  );

  ctx.save();
  ctx.translate(centerX, centerY);
  ctx.rotate(
    (sliceIndex / settings.sliceCount) * Math.PI * 2 +
      time * settings.rotationSpeed,
  );

  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(Math.cos(toRadians(6)) * radius, Math.sin(toRadians(6)) * radius);
  ctx.lineTo(Math.cos(toRadians(-6)) * radius, Math.sin(toRadians(-6)) * radius);
  ctx.closePath();

  ctx.fillStyle = gradient;
  ctx.fill();

  ctx.restore();
};

const drawPulseOverlay = (
  ctx: CanvasRenderingContext2D,
  time: number,
  settings: KaleidoscopeSettings,
) => {
  const { canvas } = ctx;
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  const centerX = width / 2;
  const centerY = height / 2;
  const maxRadius = Math.hypot(width, height) / 2;
  const wave = (Math.sin(time * 0.002) + 1) / 2;

  const gradient = ctx.createRadialGradient(
    centerX,
    centerY,
    0,
    centerX,
    centerY,
    maxRadius,
  );
  gradient.addColorStop(0, `rgba(255, 255, 255, ${0.12 * settings.pulseStrength})`);
  gradient.addColorStop(0.45, "rgba(255, 255, 255, 0.06)");
  gradient.addColorStop(1, "rgba(10, 10, 26, 0)");

  ctx.save();
  ctx.globalCompositeOperation = "screen";
  ctx.globalAlpha = 0.55 * settings.pulseStrength + wave * 0.15;
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(centerX, centerY, maxRadius * (0.65 + wave * 0.35), 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
};

const renderFrame = (
  ctx: CanvasRenderingContext2D,
  time: number,
  settings: KaleidoscopeSettings,
) => {
  const { canvas } = ctx;
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;

  ctx.clearRect(0, 0, width, height);

  for (let slice = 0; slice < settings.sliceCount; slice += 1) {
    drawSlice(ctx, slice, time, settings);
  }

  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  ctx.globalAlpha = 0.12;
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, width, height);
  ctx.restore();

  drawPulseOverlay(ctx, time, settings);
};

export const useKaleidoscopeAnimation = (
  settings: KaleidoscopeSettings = DEFAULT_KALEIDOSCOPE_SETTINGS,
) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const settingsRef = useRef(settings);

  useEffect(() => {
    settingsRef.current = settings;
  }, [settings]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    let animationFrameId: number;

    const resize = () => {
      setCanvasSize(canvas, context);
      renderFrame(context, performance.now(), settingsRef.current);
    };

    resize();

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);

    const animate = (time: number) => {
      renderFrame(context, time, settingsRef.current);
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
      observer.disconnect();
    };
  }, []);

  return canvasRef;
};

export type KaleidoscopeCanvasRef = ReturnType<typeof useKaleidoscopeAnimation>;
