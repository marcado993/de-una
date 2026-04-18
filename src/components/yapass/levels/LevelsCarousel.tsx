import { cn } from "@/lib/cn";
import { LevelsProgress } from "./molecules/LevelsProgress";
import { LevelsTrack } from "./molecules/LevelsTrack";
import type { Level } from "./types";

export type LevelsCarouselProps = {
  title?: string;
  levels: Level[];
  /** "Nivel 2" chip shown next to the progress bar. */
  currentLabel?: string;
  /** 0 → 1. Position of the teal dot on the progress bar. */
  progress?: number;
  /** Set to false to hide the bottom progress row entirely. */
  showProgress?: boolean;
  className?: string;
};

/**
 * Organism — YaPass levels carousel.
 *
 * Layout:
 *   ┌─────────────────────────────────┐
 *   │ YaPass                          │  ← title
 *   │ ┌───┐ ┌───┐ ┌───┐ ┌───┐ ┌───┐   │  ← LevelsTrack (horizontal)
 *   │ │   │ │   │ │   │ │   │ │ 💠 │   │
 *   │ └───┘ └───┘ └───┘ └───┘ └───┘   │
 *   │ Niv1  Niv2  Niv3  Niv4  Niv5    │  ← LevelNames (inside items)
 *   │ Nivel 2  ━━━●━━━━━━━━━━━        │  ← LevelsProgress
 *   └─────────────────────────────────┘
 */
export function LevelsCarousel({
  title = "YaPass",
  levels,
  currentLabel,
  progress = 0,
  showProgress = true,
  className,
}: LevelsCarouselProps) {
  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {title ? (
        <span className="text-title-md text-primary font-extrabold">{title}</span>
      ) : null}
      <LevelsTrack levels={levels} />
      {showProgress ? (
        <LevelsProgress progress={progress} currentLabel={currentLabel} />
      ) : null}
    </div>
  );
}
