import { LevelName } from "../atoms/LevelName";
import { isRewardLevel, isSponsoredLevel, type Level } from "../types";
import { LevelChip } from "./LevelChip";
import { RewardLevelChip } from "./RewardLevelChip";
import { SponsoredLevelChip } from "./SponsoredLevelChip";

export type LevelItemProps = {
  level: Level;
};

/**
 * Molecule — a single column in the levels carousel: the chip on top
 * and its "Nivel N" name beneath. Handles standard cashback chips,
 * "regalo" reward chips and sponsored chips via discriminated union.
 */
export function LevelItem({ level }: LevelItemProps) {
  const active =
    !isSponsoredLevel(level) && level.variant === "active";

  return (
    <div className="flex snap-start flex-col items-center gap-2">
      {isSponsoredLevel(level) ? (
        <SponsoredLevelChip
          sponsor={level.sponsor}
          cta={level.cta}
          theme={level.theme}
          onCtaClick={level.onCtaClick}
        />
      ) : isRewardLevel(level) ? (
        <RewardLevelChip
          imageSrc={level.imageSrc}
          label={level.label}
          variant={level.variant ?? "upcoming"}
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
