import Image from "next/image";

import { cn } from "@/lib/cn";

export type AvatarSize = "sm" | "md" | "lg";

export type AvatarProps = {
  /** Full user name. Used to auto-generate initials when none are given. */
  name?: string;
  /** Pre-computed initials. Overrides `name` when provided. */
  initials?: string;
  /** Optional avatar photo URL. When set, takes priority over initials. */
  src?: string;
  size?: AvatarSize;
  /** Accent ring around the avatar (e.g. warning yellow in the header). */
  ringClassName?: string;
  className?: string;
};

const sizeMap: Record<AvatarSize, string> = {
  sm: "h-8 w-8 text-[11px]",
  md: "h-10 w-10 text-[13px]",
  lg: "h-14 w-14 text-[16px]",
};

const pxMap: Record<AvatarSize, number> = { sm: 32, md: 40, lg: 56 };

function computeInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .map((p) => p[0] ?? "")
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

/** Atom — circular user avatar (photo or initials on a soft background). */
export function Avatar({
  name,
  initials,
  src,
  size = "md",
  ringClassName = "border-2 border-warning",
  className,
}: AvatarProps) {
  const computed = initials ?? (name ? computeInitials(name) : "");
  const px = pxMap[size];

  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary-soft",
        sizeMap[size],
        ringClassName,
        className,
      )}
    >
      {src ? (
        <Image
          src={src}
          alt={name ?? "avatar"}
          width={px}
          height={px}
          className="h-full w-full object-cover"
        />
      ) : (
        <span className="font-bold text-primary">{computed}</span>
      )}
    </div>
  );
}
