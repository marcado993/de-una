import { LevelName } from "../atoms/LevelName";
import { isSponsoredLevel, type Level } from "../types";
import { LevelChip } from "./LevelChip";
import { SponsoredLevelChip } from "./SponsoredLevelChip";

export type LevelItemProps = {
  level: Level;
};

/**
 * Molecule — a single column in the levels carousel: the chip on top
 * and its "Nivel N" name beneath. Handles both standard and sponsored
 * variants via discriminated union.
 */
export function LevelItem({ level }: LevelItemProps) {
  const active = !isSponsoredLevel(level) && level.variant === "active";

  return (
    <div className="flex snap-start flex-col items-center gap-2">
      {isSponsoredLevel(level) ? (
        <SponsoredLevelChip
          sponsor={level.sponsor}
          cta={level.cta}
          onCtaClick={level.onCtaClick}
        />
      ) : (
        <LevelChip
          amount={level.amount}
          label={level.label}
          variant={level.variant ?? "upcoming"}
        />
      )}
      <LevelName name={level.name} active={active} />
    </div>
  );
}
