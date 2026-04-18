import { cn } from "@/lib/cn";
import { LevelAmount } from "../atoms/LevelAmount";
import { LevelLabel } from "../atoms/LevelLabel";
import type { StandardLevel, StandardLevelVariant } from "../types";

export type LevelChipProps = Pick<StandardLevel, "amount" | "label"> & {
  variant?: StandardLevelVariant;
  className?: string;
};

/**
 * Variant → Tailwind classes. Kept in a single map so tuning the
 * metallic look (gradient stops, shadows) only touches one place.
 */
const variantStyles: Record<StandardLevelVariant, string> = {
  upcoming:
    "bg-[linear-gradient(165deg,var(--color-chip-gray-top)_0%,var(--color-chip-gray-mid)_55%,var(--color-chip-gray-bottom)_100%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_2px_6px_rgba(0,0,0,0.12)]",
  active:
    "bg-[linear-gradient(165deg,var(--color-chip-gray-top)_0%,var(--color-chip-gray-mid)_55%,var(--color-chip-gray-bottom)_100%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.3),0_0_0_2px_var(--color-primary),0_4px_10px_rgba(75,29,140,0.25)]",
  completed:
    "bg-[linear-gradient(165deg,#B5B1B2_0%,#8D898A_55%,#6E6A6B_100%)] opacity-70 shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_2px_5px_rgba(0,0,0,0.08)]",
};

/**
 * Molecule — the standard gray metallic level chip (110×84).
 * Composed of `LevelAmount` + `LevelLabel` on a branded background.
 */
export function LevelChip({
  amount,
  label,
  variant = "upcoming",
  className,
}: LevelChipProps) {
  return (
    <div
      className={cn(
        "flex h-[84px] w-[110px] shrink-0 flex-col items-center justify-center gap-0.5",
        "rounded-[var(--radius-md)] px-3 py-2",
        variantStyles[variant],
        className,
      )}
    >
      <LevelAmount amount={amount} tone="light" />
      <LevelLabel label={label} tone="light" />
    </div>
  );
}
