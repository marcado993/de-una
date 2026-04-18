import { cn } from "@/lib/cn";

export type LevelLabelProps = {
  label: string;
  tone?: "light" | "dark";
  className?: string;
};

/** Atom — the small "Cashback" caption beneath the amount. */
export function LevelLabel({ label, tone = "light", className }: LevelLabelProps) {
  return (
    <span
      className={cn(
        "text-[11px] font-bold leading-4",
        tone === "light" ? "text-white/95" : "text-ink",
        className,
      )}
    >
      {label}
    </span>
  );
}
