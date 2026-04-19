/**
 * Shared types for the Levels feature. Discriminated by `kind` so the
 * carousel can decide whether to render a standard chip or a sponsored
 * (branded) chip without ambiguity.
 */

export type StandardLevelVariant = "upcoming" | "active" | "completed";

export type StandardLevel = {
  id: string;
  kind?: "standard";
  /** Cashback or reward amount displayed inside the chip ("$0.70"). */
  amount: string;
  /** Reward kind label inside the chip ("Cashback"). */
  label: string;
  /** Level display name below the chip ("Nivel 3"). */
  name: string;
  variant?: StandardLevelVariant;
};

/**
 * "Regalo" level — a non-cashback reward (e.g. a sponsored yogurt). The
 * chip renders the product image with a "regalo" caption instead of a
 * money amount.
 */
export type RewardLevel = {
  id: string;
  kind: "reward";
  /** Public path to the product image shown inside the chip. */
  imageSrc: string;
  /** Caption rendered below the image ("regalo"). */
  label: string;
  /** Level display name below the chip ("Nivel 1"). */
  name: string;
  variant?: StandardLevelVariant;
};

export type SponsorTheme = "orange" | "alpina";

export type SponsoredLevel = {
  id: string;
  kind: "sponsored";
  name: string;
  sponsor: {
    /** Sponsor brand name shown on the white banner inside the chip. */
    name: string;
    /** Optional path to a sponsor logo image. Falls back to styled text. */
    logoSrc?: string;
  };
  /** CTA text rendered inside the chrome button ("Raspa y Gana!"). */
  cta: string;
  /** Visual palette for the chip body. Defaults to "orange" (Netlife-style). */
  theme?: SponsorTheme;
  onCtaClick?: () => void;
};

export type Level = StandardLevel | RewardLevel | SponsoredLevel;

export function isSponsoredLevel(level: Level): level is SponsoredLevel {
  return level.kind === "sponsored";
}

export function isRewardLevel(level: Level): level is RewardLevel {
  return level.kind === "reward";
}
