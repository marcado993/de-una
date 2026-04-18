import { cn } from "@/lib/cn";

export type EmojiSize = "sm" | "md" | "lg";

export type EmojiProps = {
  /** Single emoji character ("🍔"). Rendered as an accessible image. */
  symbol: string;
  /** Short description for screen readers ("Hamburguesa"). */
  label?: string;
  size?: EmojiSize;
  /** When true, wraps the emoji in a soft-primary rounded tile. */
  framed?: boolean;
  className?: string;
};

const sizeMap: Record<EmojiSize, { tile: string; symbol: string }> = {
  sm: { tile: "h-10 w-10", symbol: "text-xl leading-none" },
  md: { tile: "h-14 w-14", symbol: "text-[28px] leading-none" },
  lg: { tile: "h-16 w-16", symbol: "text-[32px] leading-none" },
};

/** Atom — emoji glyph, optionally framed inside a soft-primary tile. */
export function Emoji({ symbol, label, size = "md", framed, className }: EmojiProps) {
  const { tile, symbol: symbolClass } = sizeMap[size];
  const content = (
    <span role="img" aria-label={label} className={symbolClass}>
      {symbol}
    </span>
  );

  if (!framed) {
    return <span className={className}>{content}</span>;
  }

  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-primary-soft",
        tile,
        className,
      )}
    >
      {content}
    </div>
  );
}
