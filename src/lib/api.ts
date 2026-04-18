import type { Campaign, Location } from "./api-types";

export const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

/**
 * One-shot poll used to hydrate the UI on mount, so an alert that was
 * created *before* the user opened the app still surfaces. The SSE
 * stream takes care of live deltas afterwards.
 */
export async function fetchNearbyCampaigns(
  location: Location,
  radiusM = 800,
): Promise<Campaign[]> {
  const url = new URL(`${API_BASE}/campaigns/nearby`);
  url.searchParams.set("lat", String(location.lat));
  url.searchParams.set("lng", String(location.lng));
  url.searchParams.set("radiusM", String(radiusM));
  const res = await fetch(url.toString(), { cache: "no-store" });
  if (!res.ok) throw new Error(`nearby_${res.status}`);
  const { campaigns } = (await res.json()) as { campaigns: Campaign[] };
  return campaigns;
}

export function buildStreamUrl(
  location: Location,
  radiusM = 800,
): string {
  const url = new URL(`${API_BASE}/campaigns/stream`);
  url.searchParams.set("lat", String(location.lat));
  url.searchParams.set("lng", String(location.lng));
  url.searchParams.set("radiusM", String(radiusM));
  return url.toString();
}
