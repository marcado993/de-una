"use client";

import { ComponentType, SVGProps } from "react";

import { cn } from "@/lib/cn";
import { Badge } from "../atoms/Badge";

export type ActionTileIcon = ComponentType<SVGProps<SVGSVGElement>>;

export type ActionTileProps = {
  icon: ActionTileIcon;
  label: string;
  badge?: string | number;
  onPress?: () => void;
  highlight?: boolean;
};

/**
 * Molecule — a square icon tile with a label below. Used in the home
 * action grid. Optional `Badge` atom in the top-right corner.
 */
export function ActionTile({ icon: Icon, label, badge, onPress, highlight }: ActionTileProps) {
  return (
    <button
      type="button"
      onClick={onPress}
      className="flex w-[62px] shrink-0 flex-col items-center gap-1 bg-transparent transition-opacity active:opacity-70 cursor-pointer"
    >
      <div
        className={cn(
          "relative flex h-14 w-14 items-center justify-center rounded-[var(--radius-md)]",
          highlight ? "bg-primary" : "bg-primary-soft",
        )}
      >
        <Icon
          className={cn("h-[22px] w-[22px]", highlight ? "text-white" : "text-primary")}
        />
        {badge !== undefined ? (
          <Badge tone="teal" className="absolute -right-1 -top-1">
            {badge}
          </Badge>
        ) : null}
      </div>
      <span className="text-center text-[11px] leading-[14px] font-medium text-ink line-clamp-2">
        {label}
      </span>
    </button>
  );
}
