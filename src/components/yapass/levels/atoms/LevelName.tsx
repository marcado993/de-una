import { cn } from "@/lib/cn";

export type LevelNameProps = {
  name: string;
  active?: boolean;
  className?: string;
};

/** Atom — "Nivel 3" label rendered below a chip. */
export function LevelName({ name, active, className }: LevelNameProps) {
  return (
    <span
      className={cn(
        "text-xs leading-4 text-primary",
        active ? "font-extrabold" : "font-bold",
        className,
      )}
    >
      {name}
    </span>
  );
}
