import { useCallback, useMemo, useState } from "react";
import type { FocusEvent, KeyboardEvent, PointerEvent } from "react";
import {
  DEFAULT_KALEIDOSCOPE_SETTINGS,
  type KaleidoscopeSettings,
} from "./useKaleidoscopeAnimation";

type InteractionHandlers = {
  onPointerMove: (event: PointerEvent<HTMLDivElement>) => void;
  onPointerLeave: () => void;
  onPointerDown: (event: PointerEvent<HTMLDivElement>) => void;
  onKeyDown: (event: KeyboardEvent<HTMLDivElement>) => void;
  onPointerCancel: () => void;
  onBlur: (event: FocusEvent<HTMLDivElement>) => void;
  tabIndex: number;
  role: string;
  "aria-label": string;
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

const toDegreesPerSecond = (speed: number) => speed * 1000 * (180 / Math.PI);

export type KaleidoscopeControlState = {
  settings: KaleidoscopeSettings;
  sliceCount: number;
  hueVariance: number;
  rotationSpeed: number;
  pulseStrength: number;
  interactionProps: InteractionHandlers;
  formatted: {
    rotation: string;
    hueVariance: string;
    pulse: string;
  };
  reset: () => void;
};

const MIN_SLICE_COUNT = 6;
const MAX_SLICE_COUNT = 24;
const MIN_ROTATION_SPEED = 0.00018;
const MAX_ROTATION_SPEED = 0.001;
const MIN_HUE_VARIANCE = 60;
const MAX_HUE_VARIANCE = 260;
const MIN_PULSE = 0.06;
const MAX_PULSE = 0.4;

export const useKaleidoscopeControls = (): KaleidoscopeControlState => {
  const [sliceCount, setSliceCount] = useState(
    DEFAULT_KALEIDOSCOPE_SETTINGS.sliceCount,
  );
  const [hueVariance, setHueVariance] = useState(
    DEFAULT_KALEIDOSCOPE_SETTINGS.hueVariance,
  );
  const [rotationSpeed, setRotationSpeed] = useState(
    DEFAULT_KALEIDOSCOPE_SETTINGS.rotationSpeed,
  );
  const [pulseStrength, setPulseStrength] = useState(
    DEFAULT_KALEIDOSCOPE_SETTINGS.pulseStrength,
  );

  const reset = useCallback(() => {
    setSliceCount(DEFAULT_KALEIDOSCOPE_SETTINGS.sliceCount);
    setHueVariance(DEFAULT_KALEIDOSCOPE_SETTINGS.hueVariance);
    setRotationSpeed(DEFAULT_KALEIDOSCOPE_SETTINGS.rotationSpeed);
    setPulseStrength(DEFAULT_KALEIDOSCOPE_SETTINGS.pulseStrength);
  }, []);

  const applyPointerPosition = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      const target = event.currentTarget;
      const rect = target.getBoundingClientRect();
      const relativeX = clamp((event.clientX - rect.left) / rect.width, 0, 1);
      const relativeY = clamp((event.clientY - rect.top) / rect.height, 0, 1);
      const boosted = event.buttons > 1 || event.pressure > 0.45;
      const boostFactor = boosted ? 1.2 : 1;

      setHueVariance(
        MIN_HUE_VARIANCE + relativeX * (MAX_HUE_VARIANCE - MIN_HUE_VARIANCE),
      );
      setRotationSpeed(
        clamp(
          MIN_ROTATION_SPEED +
            relativeY * relativeY * (MAX_ROTATION_SPEED - MIN_ROTATION_SPEED) *
              boostFactor,
          MIN_ROTATION_SPEED,
          MAX_ROTATION_SPEED,
        ),
      );
      setPulseStrength(
        clamp(
          MIN_PULSE +
            (1 - relativeY) * (MAX_PULSE - MIN_PULSE) * boostFactor,
          MIN_PULSE,
          MAX_PULSE,
        ),
      );
    },
    [],
  );

  const handlePointerMove = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      if (event.buttons === 0 && event.pointerType === "touch") return;
      applyPointerPosition(event);
    },
    [applyPointerPosition],
  );

  const handlePointerDown = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      event.currentTarget.focus();
      applyPointerPosition(event);
    },
    [applyPointerPosition],
  );

  const handlePointerLeave = useCallback(() => {
    setHueVariance(DEFAULT_KALEIDOSCOPE_SETTINGS.hueVariance);
    setRotationSpeed(DEFAULT_KALEIDOSCOPE_SETTINGS.rotationSpeed);
    setPulseStrength(DEFAULT_KALEIDOSCOPE_SETTINGS.pulseStrength);
  }, []);

  const handleBlur = useCallback((event: FocusEvent<HTMLDivElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
      handlePointerLeave();
    }
  }, [handlePointerLeave]);

  const handleKeyDown = useCallback((event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowUp" || event.key === "ArrowRight") {
      event.preventDefault();
      setSliceCount((value) => clamp(value + 1, MIN_SLICE_COUNT, MAX_SLICE_COUNT));
    }

    if (event.key === "ArrowDown" || event.key === "ArrowLeft") {
      event.preventDefault();
      setSliceCount((value) => clamp(value - 1, MIN_SLICE_COUNT, MAX_SLICE_COUNT));
    }

    if (event.key === "r" || event.key === "R") {
      event.preventDefault();
      reset();
    }
  }, [reset]);

  const settings = useMemo(
    () => ({
      sliceCount,
      hueVariance,
      rotationSpeed,
      pulseStrength,
      baseHue: DEFAULT_KALEIDOSCOPE_SETTINGS.baseHue,
    }),
    [sliceCount, hueVariance, rotationSpeed, pulseStrength],
  );

  const formatted = useMemo(
    () => ({
      rotation: `${toDegreesPerSecond(rotationSpeed).toFixed(1)}°/s`,
      hueVariance: `${Math.round(hueVariance)}°`,
      pulse: `${Math.round(pulseStrength * 100)}%`,
    }),
    [hueVariance, pulseStrength, rotationSpeed],
  );

  return {
    settings,
    sliceCount,
    hueVariance,
    rotationSpeed,
    pulseStrength,
    interactionProps: {
      onPointerMove: handlePointerMove,
      onPointerLeave: handlePointerLeave,
      onPointerDown: handlePointerDown,
      onKeyDown: handleKeyDown,
      onPointerCancel: handlePointerLeave,
      onBlur: handleBlur,
      tabIndex: 0,
      role: "region",
      "aria-label": "Kaleidoscope 互动画布",
    },
    formatted,
    reset,
  };
};
