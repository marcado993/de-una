"use client";

import { cn } from "@/lib/cn";
import { SponsorBadge } from "../../atoms/SponsorBadge";
import type { SponsoredLevel } from "../types";

export type SponsoredLevelChipProps = Omit<SponsoredLevel, "id" | "kind" | "name"> & {
  className?: string;
};

/**
 * Molecule — the sponsored/"Raspa y Gana" level chip.
 *
 * Visually:
 *   ┌──────────────────────┐
 *   │  [ White banner w/   │  ← SponsorBadge
 *   │    sponsor brand  ]  │
 *   │  ┌────────────────┐  │
 *   │  │  CTA (chrome)  │  │  ← metallic silver button
 *   │  └────────────────┘  │
 *   └──────────────────────┘
 *
 * The orange body uses a soft radial glow + linear gradient to mimic
 * the "glossy paper card" look from the YaPass Figma / screenshot.
 */
export function SponsoredLevelChip({
  sponsor,
  cta,
  onCtaClick,
  className,
}: SponsoredLevelChipProps) {
  return (
    <div
      className={cn(
        "relative flex h-[84px] w-[110px] shrink-0 flex-col items-center justify-between gap-1.5 overflow-hidden",
        "rounded-[var(--radius-md)] p-1.5",
        "bg-[radial-gradient(circle_at_30%_30%,#FFD18A_0%,var(--color-sponsor-orange-light)_35%,var(--color-sponsor-orange)_70%,var(--color-sponsor-orange-dark)_100%)]",
        "shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_3px_8px_rgba(232,113,0,0.35)]",
        className,
      )}
    >
      <SponsorBadge name={sponsor.name} logoSrc={sponsor.logoSrc} />
      <button
        type="button"
        onClick={onCtaClick}
        className={cn(
          "flex w-full flex-1 cursor-pointer items-center justify-center rounded-[8px] px-1.5",
          "bg-[linear-gradient(to_bottom,var(--color-chrome-top)_0%,#E5E5E5_45%,var(--color-chrome-mid)_60%,var(--color-chrome-bottom)_100%)]",
          "text-[11px] font-extrabold leading-tight text-ink",
          "shadow-[inset_0_1px_0_rgba(255,255,255,0.8),inset_0_-1px_0_rgba(0,0,0,0.15),0_1px_2px_rgba(0,0,0,0.2)]",
          "transition-transform active:scale-95",
        )}
      >
        <span className="text-center drop-shadow-[0_1px_0_rgba(255,255,255,0.6)]">
          {cta}
        </span>
      </button>
    </div>
  );
}
