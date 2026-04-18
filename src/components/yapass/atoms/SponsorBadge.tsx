import Image from "next/image";

import { cn } from "@/lib/cn";

export type SponsorBadgeSize = "sm" | "md";

export type SponsorBadgeProps = {
  /** Brand name — shown as fallback text when no logo is provided. */
  name: string;
  /** Optional sponsor logo image path (served from /public). */
  logoSrc?: string;
  size?: SponsorBadgeSize;
  className?: string;
};

const sizeMap: Record<SponsorBadgeSize, { wrapper: string; text: string; img: { w: number; h: number } }> = {
  sm: {
    wrapper: "h-5 rounded-[4px] px-1",
    text: "text-[10px] font-black italic tracking-tight",
    img: { w: 56, h: 14 },
  },
  md: {
    wrapper: "h-7 rounded-[6px] px-2",
    text: "text-sm font-black italic tracking-tight",
    img: { w: 90, h: 22 },
  },
};

/**
 * Atom — the small white banner that carries a sponsor brand on top of
 * a branded surface (sponsored level chip, "Raspa y Gana" modal, etc).
 * Prioritizes a provided logo image; falls back to italic text when
 * `logoSrc` is missing so new sponsors work out of the box.
 */
export function SponsorBadge({ name, logoSrc, size = "sm", className }: SponsorBadgeProps) {
  const s = sizeMap[size];
  return (
    <div
      className={cn(
        "flex w-full items-center justify-center bg-white shadow-[0_1px_2px_rgba(0,0,0,0.15)]",
        s.wrapper,
        className,
      )}
    >
      {logoSrc ? (
        <Image
          src={logoSrc}
          alt={name}
          width={s.img.w}
          height={s.img.h}
          className="h-full w-auto object-contain"
        />
      ) : (
        <span className={cn(s.text, "text-sponsor-orange-dark")}>{name}</span>
      )}
    </div>
  );
}
