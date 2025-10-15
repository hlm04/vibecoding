import { useEffect, useRef } from "react";

const SLICE_COUNT = 12;
const BASE_HUE = 200;
const HUE_VARIANCE = 120;
const RADIUS_SCALE = 0.8;
const ROTATION_SPEED = 0.0004;

const toRadians = (angle: number) => (angle * Math.PI) / 180;

const setCanvasSize = (canvas: HTMLCanvasElement) => {
  const { devicePixelRatio = 1 } = window;
  const { clientWidth, clientHeight } = canvas;

  canvas.width = clientWidth * devicePixelRatio;
  canvas.height = clientHeight * devicePixelRatio;
};

const drawSlice = (ctx: CanvasRenderingContext2D, sliceIndex: number, time: number) => {
  const { canvas } = ctx;
  const { width, height } = canvas;
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.min(width, height) * RADIUS_SCALE;

  const hueShift = ((sliceIndex / SLICE_COUNT) * HUE_VARIANCE + time / 20) % 360;
  const gradient = ctx.createLinearGradient(-radius, -radius, radius, radius);
  gradient.addColorStop(0, `hsl(${(BASE_HUE + hueShift) % 360}, 90%, 60%)`);
  gradient.addColorStop(0.5, `hsl(${(BASE_HUE + hueShift + 30) % 360}, 80%, 55%)`);
  gradient.addColorStop(1, `hsl(${(BASE_HUE + hueShift + 60) % 360}, 75%, 50%)`);

  ctx.save();
  ctx.translate(centerX, centerY);
  ctx.rotate((sliceIndex / SLICE_COUNT) * Math.PI * 2 + time * ROTATION_SPEED);

  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(Math.cos(toRadians(6)) * radius, Math.sin(toRadians(6)) * radius);
  ctx.lineTo(Math.cos(toRadians(-6)) * radius, Math.sin(toRadians(-6)) * radius);
  ctx.closePath();

  ctx.fillStyle = gradient;
  ctx.fill();

  ctx.restore();
};

const renderFrame = (ctx: CanvasRenderingContext2D, time: number) => {
  const { canvas } = ctx;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let slice = 0; slice < SLICE_COUNT; slice += 1) {
    drawSlice(ctx, slice, time);
  }

  ctx.globalCompositeOperation = "lighter";
  ctx.globalAlpha = 0.15;
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.globalAlpha = 1;
  ctx.globalCompositeOperation = "source-over";
};

export const useKaleidoscopeAnimation = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    let animationFrameId: number;

    const resize = () => {
      setCanvasSize(canvas);
      renderFrame(context, performance.now());
    };

    resize();

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);

    const animate = (time: number) => {
      renderFrame(context, time);
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
