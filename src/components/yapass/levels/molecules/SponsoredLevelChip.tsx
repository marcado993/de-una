"use client";

import { cn } from "@/lib/cn";
import { SponsorBadge } from "../../atoms/SponsorBadge";
import type { SponsorTheme, SponsoredLevel } from "../types";

export type SponsoredLevelChipProps = Omit<SponsoredLevel, "id" | "kind" | "name"> & {
  className?: string;
};

/**
 * Per-sponsor visual palette. Each theme owns the chip body gradient and
 * the outer shadow tint so a new sponsor can be added without touching
 * any consumer.
 */
const THEMES: Record<
  SponsorTheme,
  { body: string; shadow: string; ctaText: string }
> = {
  orange: {
    body: "bg-[radial-gradient(circle_at_30%_30%,#FFD18A_0%,var(--color-sponsor-orange-light)_35%,var(--color-sponsor-orange)_70%,var(--color-sponsor-orange-dark)_100%)]",
    shadow:
      "shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_3px_8px_rgba(232,113,0,0.35)]",
    ctaText: "text-ink",
  },
  // Alpina lockup: the chip body is a soft sky-blue glow that matches the
  // brand's marketing materials, and the chrome CTA reads in dark blue
  // for legible contrast against the silver button.
  alpina: {
    body: "bg-[radial-gradient(circle_at_30%_25%,#E8F3FF_0%,#A9D2FF_45%,#5BA3F0_85%,#2F77C9_100%)]",
    shadow:
      "shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_3px_8px_rgba(36,98,178,0.40)]",
    ctaText: "text-[#0e255e]",
  },
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
  theme = "orange",
  className,
}: SponsoredLevelChipProps) {
  const t = THEMES[theme];
  return (
    <div
      className={cn(
        "relative flex h-[84px] w-[110px] shrink-0 flex-col items-center justify-between gap-1.5 overflow-hidden",
        "rounded-[var(--radius-md)] p-1.5",
        t.body,
        t.shadow,
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
          "text-[11px] font-extrabold leading-tight",
          t.ctaText,
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
