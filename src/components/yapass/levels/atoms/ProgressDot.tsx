import { cn } from "@/lib/cn";

export type ProgressDotProps = {
  /** 0 → 1 horizontal position along a track. Clamped. */
  position: number;
  className?: string;
};

/**
 * Atom — the teal marker dot that rides on top of a progress track.
 * Designed to be absolutely positioned inside a relatively-positioned
 * parent that wraps a `ProgressTrack`.
 */
export function ProgressDot({ position, className }: ProgressDotProps) {
  const clamped = Math.min(1, Math.max(0, position));
  return (
    <span
      aria-hidden="true"
      style={{ left: `${clamped * 100}%` }}
      className={cn(
        "absolute top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full",
        "bg-teal ring-2 ring-white shadow-[0_1px_3px_rgba(0,0,0,0.2)]",
        className,
      )}
    />
  );
}
