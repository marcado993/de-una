import { cn } from "@/lib/cn";

export type BadgeTone = "teal" | "primary" | "warning" | "danger" | "success";
export type BadgeSize = "xs" | "sm";

export type BadgeProps = {
  children: React.ReactNode;
  tone?: BadgeTone;
  size?: BadgeSize;
  className?: string;
};

const toneMap: Record<BadgeTone, string> = {
  teal: "bg-teal text-white",
  primary: "bg-primary text-white",
  warning: "bg-warning text-ink",
  danger: "bg-danger text-white",
  success: "bg-success text-white",
};

const sizeMap: Record<BadgeSize, string> = {
  xs: "h-4 min-w-4 px-1 text-[10px]",
  sm: "h-5 min-w-5 px-1.5 text-[11px]",
};

/**
 * Atom — tiny pill/circle used as a notification indicator or counter.
 * Designed to be positioned absolutely on top of another element
 * (e.g. top-right corner of an action tile).
 */
export function Badge({ children, tone = "teal", size = "xs", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-full font-bold leading-none",
        toneMap[tone],
        sizeMap[size],
        className,
      )}
    >
      {children}
    </span>
  );
}
