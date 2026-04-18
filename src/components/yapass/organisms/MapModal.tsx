"use client";

import { useMemo } from "react";
import {
  IoLocationSharp,
  IoLocateOutline,
  IoRefreshOutline,
  IoWarningOutline,
} from "react-icons/io5";

import { cn } from "@/lib/cn";
import { useGeolocation } from "@/hooks/use-geolocation";
import { IconButton } from "../atoms/IconButton";
import { SpinnerRing } from "../atoms/SpinnerRing";
import { MapSection, type MapLocal } from "./MapSection";
import { PopupModal } from "./PopupModal";

export type MapModalProps = {
  visible: boolean;
  onClose: () => void;
  locales: MapLocal[];
  /** Center used when GPS is unavailable / denied / pending. */
  fallbackCenter?: { lat: number; lng: number };
  onSelectLocal?: (local: MapLocal) => void;
  title?: string;
  /** If true (default) watches the GPS continuously while the modal is open. */
  watch?: boolean;
};

/**
 * Organism — immersive "Locales cerca de ti" map modal.
 *
 * Composition:
 *   PopupModal size="full"
 *   ├── Header   (title + live GPS status + refresh)
 *   └── MapSection  (centered on user location when granted)
 *
 * Geolocation is handled via the shared `useGeolocation` hook. The hook
 * only prompts the user once the modal becomes visible, and clears its
 * watcher on close — so we never ask for permission in the background.
 */
export function MapModal({
  visible,
  onClose,
  locales,
  fallbackCenter = { lat: -0.1696, lng: -78.476 },
  onSelectLocal,
  title = "Locales cerca de ti",
  watch = true,
}: MapModalProps) {
  const geo = useGeolocation({ enabled: visible, watch });

  const center = useMemo(
    () => geo.position ?? fallbackCenter,
    [geo.position, fallbackCenter],
  );

  const status = geo.status;
  const isLoading = status === "loading";
  const hasFix = status === "granted";
  const hasFailure =
    status === "denied" || status === "unavailable" || status === "error";

  const statusText = (() => {
    if (isLoading) return "Obteniendo tu ubicación…";
    if (hasFix && geo.accuracy != null)
      return `Ubicación activa · ±${Math.round(geo.accuracy)} m`;
    if (hasFix) return "Ubicación activa";
    if (status === "denied")
      return "Permiso denegado · mostrando La Floresta";
    if (status === "unavailable")
      return "GPS no disponible · mostrando La Floresta";
    if (status === "error") return "No pudimos ubicarte · mostrando La Floresta";
    return "Preparando mapa…";
  })();

  const statusIcon = (() => {
    if (isLoading) return <SpinnerRing size="sm" className="text-primary" />;
    if (hasFix) return <IoLocateOutline className="h-4 w-4 text-teal" />;
    if (hasFailure) return <IoWarningOutline className="h-4 w-4 text-warning" />;
    return <IoLocationSharp className="h-4 w-4 text-primary" />;
  })();

  return (
    <PopupModal
      visible={visible}
      title=""
      onClose={onClose}
      size="full"
      className="!bg-surface"
    >
      <header className="flex items-center gap-3 border-b border-divider bg-white/80 px-4 py-3 pr-14 backdrop-blur-sm">
        <div
          className={cn(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
            hasFix ? "bg-teal/15" : hasFailure ? "bg-warning/20" : "bg-primary-soft",
          )}
        >
          {statusIcon}
        </div>
        <div className="flex min-w-0 flex-col">
          <span className="text-title-sm truncate text-primary">{title}</span>
          <span className="truncate text-[11px] font-medium text-text-secondary">
            {statusText}
          </span>
        </div>
        <div className="flex-1" />
        <IconButton
          aria-label="Actualizar ubicación"
          onClick={geo.refresh}
          variant="soft"
          size="sm"
          disabled={isLoading}
          icon={
            <IoRefreshOutline
              className={cn("h-5 w-5", isLoading && "animate-spin")}
            />
          }
        />
      </header>

      <div className="relative min-h-0 flex-1">
        <MapSection
          center={center}
          locales={locales}
          userLocation={geo.position}
          onSelectLocal={onSelectLocal}
          height="100%"
        />
      </div>
    </PopupModal>
  );
}
