"use client";

import { useSearchParams } from "next/navigation";
import { useMemo } from "react";

import type { Location } from "@/lib/api-types";
import { useGeolocation } from "./use-geolocation";

type EffectiveLocationResult = {
  location: Location;
  source: "mock" | "gps" | "fallback";
  gpsStatus: ReturnType<typeof useGeolocation>["status"];
  refresh: () => void;
};

/**
 * Resolves the "current user" location combining (in order):
 *   1. `?mock=lat,lng` — demo escape hatch, wins if present.
 *   2. Real browser geolocation.
 *   3. `fallback` — keeps the UI usable before GPS resolves.
 */
export function useEffectiveLocation(
  fallback: Location,
  options: { enabled?: boolean; watch?: boolean } = {},
): EffectiveLocationResult {
  const { enabled = true, watch = false } = options;
  const params = useSearchParams();

  const mockParam = params.get("mock");
  const mockLocation = useMemo<Location | null>(() => {
    if (!mockParam) return null;
    const [latStr, lngStr] = mockParam.split(",");
    const lat = Number(latStr);
    const lng = Number(lngStr);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
    return { lat, lng };
  }, [mockParam]);

  const geo = useGeolocation({
    enabled: enabled && !mockLocation,
    watch,
  });

  if (mockLocation) {
    return {
      location: mockLocation,
      source: "mock",
      gpsStatus: "idle",
      refresh: () => {},
    };
  }

  if (geo.position) {
    return {
      location: geo.position,
      source: "gps",
      gpsStatus: geo.status,
      refresh: geo.refresh,
    };
  }

  return {
    location: fallback,
    source: "fallback",
    gpsStatus: geo.status,
    refresh: geo.refresh,
  };
}
