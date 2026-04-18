/**
 * Atomic design barrel for the Levels feature.
 *
 *   atoms/      → LevelAmount · LevelLabel · LevelName
 *                 ProgressTrack · ProgressDot · SponsorBadge
 *   molecules/  → LevelChip · SponsoredLevelChip · LevelItem
 *                 LevelsTrack · LevelsProgress
 *   organism    → LevelsCarousel
 *
 * Each level flows through the tree: tweak a token in globals.css,
 * an atom for typography/shape, a molecule for composition, or the
 * organism for layout. No piece depends on another piece's styling.
 */

// Atoms
export { LevelAmount } from "./atoms/LevelAmount";
export type { LevelAmountProps } from "./atoms/LevelAmount";
export { LevelLabel } from "./atoms/LevelLabel";
export type { LevelLabelProps } from "./atoms/LevelLabel";
export { LevelName } from "./atoms/LevelName";
export type { LevelNameProps } from "./atoms/LevelName";
export { ProgressTrack } from "./atoms/ProgressTrack";
export type { ProgressTrackProps } from "./atoms/ProgressTrack";
export { ProgressDot } from "./atoms/ProgressDot";
export type { ProgressDotProps } from "./atoms/ProgressDot";

// Molecules
export { LevelChip } from "./molecules/LevelChip";
export type { LevelChipProps } from "./molecules/LevelChip";
export { SponsoredLevelChip } from "./molecules/SponsoredLevelChip";
export type { SponsoredLevelChipProps } from "./molecules/SponsoredLevelChip";
export { LevelItem } from "./molecules/LevelItem";
export type { LevelItemProps } from "./molecules/LevelItem";
export { LevelsTrack } from "./molecules/LevelsTrack";
export type { LevelsTrackProps } from "./molecules/LevelsTrack";
export { LevelsProgress } from "./molecules/LevelsProgress";
export type { LevelsProgressProps } from "./molecules/LevelsProgress";

// Organism
export { LevelsCarousel } from "./LevelsCarousel";
export type { LevelsCarouselProps } from "./LevelsCarousel";

// Types
export type {
  Level,
  StandardLevel,
  StandardLevelVariant,
  SponsoredLevel,
} from "./types";
export { isSponsoredLevel } from "./types";
