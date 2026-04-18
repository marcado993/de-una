import { cn } from "@/lib/cn";

export type AmountTextSize = "sm" | "md" | "lg" | "xl";

export type AmountTextProps = {
  /** Either a raw number (formatted with `toFixed(2)`) or a ready string. */
  value: number | string;
  currency?: string;
  /** When false, replaces digits with bullets. Useful for "saldo oculto". */
  visible?: boolean;
  size?: AmountTextSize;
  className?: string;
};

const sizeMap: Record<AmountTextSize, string> = {
  sm: "text-lg leading-6",
  md: "text-2xl leading-7",
  lg: "text-[28px] leading-8",
  xl: "text-[34px] leading-[38px]",
};

function formatNumber(value: number, currency: string): string {
  return `${currency}${value.toFixed(2)}`;
}

/**
 * Atom — large bold currency display, e.g. the balance "$0.02".
 * Handles the masked "$•••" state centrally so every screen is consistent.
 */
export function AmountText({
  value,
  currency = "$",
  visible = true,
  size = "xl",
  className,
}: AmountTextProps) {
  const formatted = typeof value === "number" ? formatNumber(value, currency) : value;
  const shown = visible
    ? formatted
    : `${currency}${"•".repeat(Math.max(formatted.length - currency.length, 4))}`;

  return (
    <span
      className={cn("font-extrabold tracking-tight text-ink", sizeMap[size], className)}
      aria-live="polite"
    >
      {shown}
    </span>
  );
}
