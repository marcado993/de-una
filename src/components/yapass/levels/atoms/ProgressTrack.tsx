import { cn } from "@/lib/cn";

export type ProgressTrackProps = {
  /** 0 → 1 fraction. Values outside the range are clamped. */
  value: number;
  className?: string;
  /** Tailwind utility controlling the track background. */
  trackClassName?: string;
  /** Tailwind utility controlling the filled portion. */
  fillClassName?: string;
};

/**
 * Atom — a horizontal progress bar. Stateless; does not know about
 * levels or dots. Compose with `ProgressDot` if you need a marker.
 */
export function ProgressTrack({
  value,
  className,
  trackClassName = "bg-surface-alt",
  fillClassName = "bg-teal",
}: ProgressTrackProps) {
  const clamped = Math.min(1, Math.max(0, value));
  return (
    <div
      className={cn(
        "relative h-1 w-full overflow-hidden rounded-full",
        trackClassName,
        className,
      )}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(clamped * 100)}
    >
      <div
        className={cn("h-full rounded-full transition-[width] duration-500", fillClassName)}
        style={{ width: `${clamped * 100}%` }}
      />
    </div>
  );
}
