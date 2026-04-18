"use client";

import {
  IoHeadsetOutline,
  IoLocationOutline,
  IoNotificationsOutline,
} from "react-icons/io5";

import { Avatar } from "../atoms/Avatar";
import { IconButton } from "../atoms/IconButton";

export type ScreenHeaderProps = {
  name: string;
  initials?: string;
  avatarSrc?: string;
  location?: string;
  onBellPress?: () => void;
  onHelpPress?: () => void;
};

/**
 * Molecule — the top "Hola {name} 👋" header shared across tabs.
 * Composed of: `Avatar` + greeting + `IconButton`s (bell, help), with
 * an optional location chip below.
 */
export function ScreenHeader({
  name,
  initials,
  avatarSrc,
  location,
  onBellPress,
  onHelpPress,
}: ScreenHeaderProps) {
  return (
    <div className="flex flex-col gap-2 px-4 pt-2">
      <div className="flex items-center justify-between">
        <div className="flex shrink items-center gap-3">
          <Avatar name={name} initials={initials} src={avatarSrc} />
          <span className="shrink text-title-sm">
            Hola {name} <span className="text-base">👋</span>
          </span>
        </div>
        <div className="flex items-center gap-3">
          <IconButton
            aria-label="Notificaciones"
            onClick={onBellPress}
            icon={<IoNotificationsOutline className="h-[22px] w-[22px] text-ink" />}
          />
          <IconButton
            aria-label="Ayuda"
            onClick={onHelpPress}
            icon={<IoHeadsetOutline className="h-[22px] w-[22px] text-ink" />}
          />
        </div>
      </div>
      {location ? (
        <div className="flex items-center gap-1 self-center">
          <IoLocationOutline className="h-4 w-4 text-primary" />
          <span className="text-body font-semibold">{location}</span>
        </div>
      ) : null}
    </div>
  );
}
