"use client";

import {
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import { cn } from "@/lib/cn";

export type ScratchCardProps = {
  /** Logical CSS width in px. Canvas is internally scaled by DPR. */
  width?: number;
  /** Logical CSS height in px. */
  height?: number;
  /** Prize / reveal content rendered underneath the foil. */
  children: ReactNode;
  /** Fraction (0→1) of foil that must be scratched before auto-reveal. */
  threshold?: number;
  /** Brush radius in CSS px (half of the stroke width). */
  brushRadius?: number;
  /** Text painted on the foil as a hint ("Rasca aquí"). Erases naturally. */
  hintText?: string;
  /** Foil gradient stops — from top-left → bottom-right. */
  foilColors?: [string, string, string];
  /** Called exactly once when the reveal threshold is crossed. */
  onReveal?: () => void;
  className?: string;
  style?: CSSProperties;
};

const DEFAULT_FOIL: [string, string, string] = ["#D8D8DB", "#A8A9AC", "#C6C7CA"];

/**
 * Atom — interactive scratch-to-reveal card.
 *
 * Layout:
 *   ┌─────────────────────────────┐
 *   │  prize content (children)   │  ← absolute, always rendered
 *   │     ┌─────────────────┐     │
 *   │     │  silver foil    │     │  ← canvas on top, erased on drag
 *   │     └─────────────────┘     │
 *   └─────────────────────────────┘
 *
 * Pointer events are unified (mouse + touch + pen). The foil is drawn
 * once on mount and then erased with `globalCompositeOperation = "destination-out"`.
 * After each pointer up we sample the alpha channel to decide whether
 * the `threshold` has been crossed; if so we fade out the canvas and
 * call `onReveal`.
 */
export function ScratchCard({
  width = 260,
  height = 150,
  children,
  threshold = 0.55,
  brushRadius = 22,
  hintText = "Rasca aquí ✨",
  foilColors = DEFAULT_FOIL,
  onReveal,
  className,
  style,
}: ScratchCardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawingRef = useRef(false);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);
  const revealedRef = useRef(false);
  const [revealed, setRevealed] = useState(false);

  // Paint the foil once on mount / when dimensions change.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.scale(dpr, dpr);

    // Metallic silver foil gradient
    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, foilColors[0]);
    grad.addColorStop(0.5, foilColors[1]);
    grad.addColorStop(1, foilColors[2]);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Sparkle specks — purely decorative
    ctx.fillStyle = "rgba(255,255,255,0.4)";
    for (let i = 0; i < 60; i += 1) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      ctx.beginPath();
      ctx.arc(x, y, Math.random() * 1.4, 0, Math.PI * 2);
      ctx.fill();
    }

    // Hint text in the center
    if (hintText) {
      ctx.fillStyle = "rgba(30,30,35,0.6)";
      ctx.font = "700 15px system-ui, -apple-system, 'Segoe UI', sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(hintText, width / 2, height / 2);
    }

    // Switch mode so subsequent strokes erase pixels
    ctx.globalCompositeOperation = "destination-out";
    ctx.strokeStyle = "rgba(0,0,0,1)";
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = brushRadius * 2;

    revealedRef.current = false;
    setRevealed(false);
  }, [width, height, hintText, foilColors, brushRadius]);

  const getPoint = useCallback(
    (e: ReactPointerEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return null;
      const rect = canvas.getBoundingClientRect();
      return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    },
    [],
  );

  const drawLine = useCallback(
    (from: { x: number; y: number }, to: { x: number; y: number }) => {
      const ctx = canvasRef.current?.getContext("2d");
      if (!ctx) return;
      ctx.beginPath();
      ctx.moveTo(from.x, from.y);
      ctx.lineTo(to.x, to.y);
      ctx.stroke();
    },
    [],
  );

  /** Sample the alpha channel to compute how much of the foil is gone. */
  const computeRevealedFraction = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return 0;
    const ctx = canvas.getContext("2d");
    if (!ctx) return 0;
    const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height);
    // Sample every 16th pixel for performance. Alpha is the 4th byte.
    const stride = 16;
    let transparent = 0;
    let total = 0;
    for (let i = 3; i < data.length; i += 4 * stride) {
      total += 1;
      if (data[i] === 0) transparent += 1;
    }
    return total === 0 ? 0 : transparent / total;
  }, []);

  const checkReveal = useCallback(() => {
    if (revealedRef.current) return;
    const fraction = computeRevealedFraction();
    if (fraction >= threshold) {
      revealedRef.current = true;
      setRevealed(true);
      const canvas = canvasRef.current;
      if (canvas) {
        canvas.style.transition = "opacity 450ms ease";
        canvas.style.opacity = "0";
        // Disable further pointer events on the canvas
        canvas.style.pointerEvents = "none";
      }
      onReveal?.();
    }
  }, [computeRevealedFraction, onReveal, threshold]);

  const handlePointerDown = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    if (revealedRef.current) return;
    drawingRef.current = true;
    const p = getPoint(e);
    if (!p) return;
    lastPointRef.current = p;
    // Paint a single dot so a simple tap also scratches
    drawLine(p, { x: p.x + 0.01, y: p.y + 0.01 });
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // Some browsers (older Safari) don't support pointer capture on canvas
    }
  };

  const handlePointerMove = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    if (!drawingRef.current || revealedRef.current) return;
    const p = getPoint(e);
    if (!p) return;
    const last = lastPointRef.current ?? p;
    drawLine(last, p);
    lastPointRef.current = p;
  };

  const endStroke = () => {
    if (!drawingRef.current) return;
    drawingRef.current = false;
    lastPointRef.current = null;
    checkReveal();
  };

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[var(--radius-md)] bg-white",
        "shadow-[inset_0_0_0_1px_rgba(0,0,0,0.06),0_4px_12px_rgba(75,29,140,0.15)]",
        className,
      )}
      style={{ width, height, ...style }}
    >
      <div
        className={cn(
          "absolute inset-0 flex items-center justify-center p-3 text-center transition-transform duration-500 ease-out",
          revealed ? "animate-[yp-prize-pop_450ms_ease-out]" : "",
        )}
      >
        {children}
      </div>

      <canvas
        ref={canvasRef}
        className="absolute inset-0 touch-none cursor-grab active:cursor-grabbing"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={endStroke}
        onPointerLeave={endStroke}
        onPointerCancel={endStroke}
        aria-hidden="true"
      />
    </div>
  );
}
