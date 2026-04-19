import Image from "next/image";

import { cn } from "@/lib/cn";
import type { RewardLevel, StandardLevelVariant } from "../types";

export type RewardLevelChipProps = Pick<RewardLevel, "imageSrc" | "label"> & {
  variant?: StandardLevelVariant;
  className?: string;
};

const SHAPE_BASE =
  "h-[84px] w-[110px] shrink-0 rounded-[var(--radius-md)] border border-divider";

const SURFACE =
  "bg-[linear-gradient(165deg,#FFFFFF_0%,#F4ECEC_55%,#E7D8D8_100%)] " +
  "shadow-[inset_0_1px_0_rgba(255,255,255,0.7),0_3px_8px_rgba(75,29,140,0.10)]";

/**
 * Molecule — a "regalo" reward chip. Same outer shape as `LevelChip`
 * (110×84) so the carousel rail stays visually consistent, but the body
 * is dominated by a product image (e.g. Alpina yogurt cup) with a small
 * caption underneath. Locked variant gets the same dark scrim as the
 * cashback chip so the whole rail can express progression uniformly.
 */
export function RewardLevelChip({
  imageSrc,
  label,
  variant = "upcoming",
  className,
}: RewardLevelChipProps) {
  const isLocked = variant === "upcoming";

  return (
    <div
      className={cn(
        "relative flex flex-col items-center justify-center gap-1 overflow-hidden px-2 py-1.5",
        SHAPE_BASE,
        SURFACE,
        className,
      )}
    >
      <div className="relative h-[52px] w-[52px] shrink-0">
        <Image
          src={imageSrc}
          alt={label}
          fill
          sizes="52px"
          className="object-contain"
        />
      </div>
      <span className="text-[12px] font-bold uppercase leading-none text-primary">
        {label}
      </span>

      {isLocked ? (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[inherit] bg-[linear-gradient(135deg,rgba(20,15,30,0.18)_0%,rgba(20,15,30,0.42)_60%,rgba(20,15,30,0.55)_100%)]"
        />
      ) : null}
    </div>
  );
}
