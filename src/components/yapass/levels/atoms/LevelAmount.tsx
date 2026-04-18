import { cn } from "@/lib/cn";

export type LevelAmountProps = {
  amount: string;
  tone?: "light" | "dark";
  className?: string;
};

/** Atom — the big "$0.70" amount rendered inside a level chip. */
export function LevelAmount({ amount, tone = "light", className }: LevelAmountProps) {
  return (
    <span
      className={cn(
        "text-base font-extrabold leading-[22px] tracking-tight",
        tone === "light" ? "text-white" : "text-ink",
        className,
      )}
    >
      {amount}
    </span>
  );
}
