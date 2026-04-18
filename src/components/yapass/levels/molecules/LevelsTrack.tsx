import type { Level } from "../types";
import { LevelItem } from "./LevelItem";

export type LevelsTrackProps = {
  levels: Level[];
};

/**
 * Molecule — horizontal scrolling rail of `LevelItem`s. Hides the
 * native scrollbar (via `.no-scrollbar`) and snaps chip-by-chip.
 */
export function LevelsTrack({ levels }: LevelsTrackProps) {
  return (
    <div className="no-scrollbar -mx-1 flex snap-x snap-mandatory gap-3 overflow-x-auto px-1 pb-1">
      {levels.map((level) => (
        <LevelItem key={level.id} level={level} />
      ))}
    </div>
  );
}
