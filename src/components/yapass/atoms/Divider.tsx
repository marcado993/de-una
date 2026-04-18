import { cn } from "@/lib/cn";

export type DividerProps = {
  orientation?: "horizontal" | "vertical";
  className?: string;
};

/** Atom — 1px hairline used to separate content within cards. */
export function Divider({ orientation = "horizontal", className }: DividerProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "bg-divider",
        orientation === "horizontal" ? "h-px w-full" : "h-full w-px",
        className,
      )}
    />
  );
}
