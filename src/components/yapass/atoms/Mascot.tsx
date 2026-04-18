import Image from "next/image";

import { cn } from "@/lib/cn";

export type MascotProps = {
  size?: number;
  className?: string;
};

/**
 * Atom — YaPass mascot illustration (`/public/assets/mascota.png`).
 * Transparent wrapper so it can float over any surface.
 */
export function Mascot({ size = 96, className }: MascotProps) {
  return (
    <div
      className={cn("inline-flex items-center justify-center bg-transparent", className)}
      style={{ width: size, height: size }}
    >
      <Image
        src="/assets/mascota.png"
        alt="Mascota YaPass"
        width={size}
        height={size}
        className="h-full w-full object-contain"
        priority
      />
    </div>
  );
}
