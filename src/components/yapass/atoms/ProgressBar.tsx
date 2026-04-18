import { cn } from "@/lib/cn";

export type ProgressBarProps = {
  /** 0 → 1. Values outside the range are clamped. */
  value: number;
  className?: string;
  /** Tailwind utilities controlling the track background. */
  trackClassName?: string;
  /** Tailwind utilities controlling the filled portion. */
  fillClassName?: string;
  /** Track height utility. Defaults to `h-1`. */
  heightClassName?: string;
  /** Accessible label for assistive technologies. */
  "aria-label"?: string;
};

/**
 * Atom — generic horizontal progress bar. Stateless and unaware of
 * the domain (levels, challenges, uploads, etc). Colors are configurable
 * so every consumer can brand it without re-implementing the bar.
 */
export function ProgressBar({
  value,
  className,
  trackClassName = "bg-surface-alt",
  fillClassName = "bg-primary",
  heightClassName = "h-1",
  "aria-label": ariaLabel,
}: ProgressBarProps) {
  const clamped = Math.min(1, Math.max(0, value));
  const pct = Math.round(clamped * 100);

  return (
    <div
      role="progressbar"
      aria-label={ariaLabel}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={pct}
      className={cn(
        "relative w-full overflow-hidden rounded-full",
        heightClassName,
        trackClassName,
        className,
      )}
    >
      <div
        className={cn("h-full rounded-full transition-[width] duration-500", fillClassName)}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
