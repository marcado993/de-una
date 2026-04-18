import { cn } from "@/lib/cn";
import { ProgressDot } from "../atoms/ProgressDot";
import { ProgressTrack } from "../atoms/ProgressTrack";

export type LevelsProgressProps = {
  /** 0 → 1. Where the user currently sits across the level path. */
  progress: number;
  /** Small teal tag rendered before the bar ("Nivel 2"). */
  currentLabel?: string;
  className?: string;
};

/**
 * Molecule — "Nivel 2 ━━━●━━━" progress indicator. Composes a
 * `ProgressTrack` with a `ProgressDot` riding on top of the fill.
 */
export function LevelsProgress({
  progress,
  currentLabel,
  className,
}: LevelsProgressProps) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      {currentLabel ? (
        <span className="shrink-0 text-xs font-extrabold leading-4 text-teal">
          {currentLabel}
        </span>
      ) : null}
      <div className="relative flex-1">
        <ProgressTrack value={progress} />
        <ProgressDot position={progress} />
      </div>
    </div>
  );
}
