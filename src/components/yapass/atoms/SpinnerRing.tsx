import { cn } from "@/lib/cn";

export type SpinnerRingSize = "sm" | "md" | "lg";

export type SpinnerRingProps = {
  size?: SpinnerRingSize;
  className?: string;
};

const sizeMap: Record<SpinnerRingSize, string> = {
  sm: "h-4 w-4 border-2",
  md: "h-5 w-5 border-2",
  lg: "h-6 w-6 border-[3px]",
};

/**
 * Atom — loading spinner. Inherits `currentColor` so it matches the
 * surrounding text/button color automatically.
 */
export function SpinnerRing({ size = "md", className }: SpinnerRingProps) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-block animate-spin rounded-full border-current border-t-transparent",
        sizeMap[size],
        className,
      )}
    />
  );
}
