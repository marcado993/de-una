"use client";

import { useEffect, useReducer, useRef } from "react";

import type { Campaign, Location } from "@/lib/api-types";
import { buildStreamUrl } from "@/lib/api";

const DISMISSED_KEY = "yapass:dismissed-campaigns";
/**
 * Client-side time-to-live for a delivered campaign. Anything older
 * than this falls out of the visible list so the UI never shows a
 * stale alert — the contract is "only currently-broadcasting promos
 * reach the screen". 90 s is a compromise between giving the user
 * enough time to read the modal and honoring the "solo los actuales"
 * intent the product owner set.
 */
const CAMPAIGN_TTL_MS = 90_000;
const PRUNE_INTERVAL_MS = 5_000;

type State = {
  campaigns: Campaign[];
  dismissedIds: Set<string>;
  connected: boolean;
  error: string | null;
};

type Action =
  | { type: "connect" }
  | { type: "disconnect"; error?: string | null }
  | { type: "append"; campaign: Campaign }
  | { type: "dismiss"; id: string }
  | { type: "hydrate-dismissed"; ids: string[] }
  | { type: "prune"; nowMs: number; ttlMs: number };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "connect":
      return { ...state, connected: true, error: null };
    case "disconnect":
      return { ...state, connected: false, error: action.error ?? null };
    case "append":
      if (state.campaigns.some((c) => c.id === action.campaign.id)) return state;
      return { ...state, campaigns: [action.campaign, ...state.campaigns] };
    case "dismiss": {
      const next = new Set(state.dismissedIds);
      next.add(action.id);
      return { ...state, dismissedIds: next };
    }
    case "hydrate-dismissed":
      return { ...state, dismissedIds: new Set(action.ids) };
    case "prune": {
      const cutoff = action.nowMs - action.ttlMs;
      const fresh = state.campaigns.filter((c) => {
        const createdAt = new Date(c.createdAt).getTime();
        if (!Number.isFinite(createdAt)) return false;
        return createdAt >= cutoff;
      });
      if (fresh.length === state.campaigns.length) return state;
      return { ...state, campaigns: fresh };
    }
    default:
      return state;
  }
}

function loadDismissed(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(DISMISSED_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === "string") : [];
  } catch {
    return [];
  }
}

function saveDismissed(ids: Set<string>): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(DISMISSED_KEY, JSON.stringify(Array.from(ids)));
  } catch {
    // Private mode / quota — best effort, drop silently.
  }
}

export type UseCampaignStreamOptions = {
  enabled: boolean;
  location: Location | null;
  radiusM?: number;
};

export type UseCampaignStreamResult = {
  campaigns: Campaign[];
  /** Newest non-dismissed campaign, or null. */
  latest: Campaign | null;
  connected: boolean;
  error: string | null;
  dismiss: (id: string) => void;
};

/**
 * Opens a long-lived SSE connection to `deuna-api` and collects live
 * campaign broadcasts.
 *
 * Deliberately **does not** hydrate from `/campaigns/nearby`: the
 * product rule is "only currently-broadcasting promos should reach
 * the client". Anything older than {@link CAMPAIGN_TTL_MS} is
 * periodically pruned so a delivered alert that lingered on screen
 * never feels like a stale banner.
 *
 * Dismissed ids still persist in `localStorage` so a user who closed
 * a modal doesn't see the same promo pop up again inside the TTL.
 */
export function useCampaignStream({
  enabled,
  location,
  radiusM = 800,
}: UseCampaignStreamOptions): UseCampaignStreamResult {
  const [state, dispatch] = useReducer(reducer, null, () => ({
    campaigns: [],
    dismissedIds: new Set<string>(),
    connected: false,
    error: null,
  }));

  const esRef = useRef<EventSource | null>(null);
  const locationKey = location ? `${location.lat},${location.lng}` : "none";

  useEffect(() => {
    const ids = loadDismissed();
    if (ids.length > 0) dispatch({ type: "hydrate-dismissed", ids });
  }, []);

  useEffect(() => {
    saveDismissed(state.dismissedIds);
  }, [state.dismissedIds]);

  // Periodically drop campaigns that aged past the TTL. The interval
  // lives independently of the SSE connection because a stale alert
  // should disappear even when the socket is down.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const id = window.setInterval(() => {
      dispatch({ type: "prune", nowMs: Date.now(), ttlMs: CAMPAIGN_TTL_MS });
    }, PRUNE_INTERVAL_MS);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    if (locationKey === "none") return;
    if (typeof window === "undefined" || typeof EventSource === "undefined") return;

    // Parse the primitive key back into a `Location` — this keeps the
    // deps list hash-stable (object identity would force a reconnect
    // on every parent render even when coordinates didn't change).
    const [latStr, lngStr] = locationKey.split(",");
    const lat = Number(latStr);
    const lng = Number(lngStr);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return;
    const current: Location = { lat, lng };

    let cancelled = false;

    const streamUrl = buildStreamUrl(current, radiusM);
    console.debug("[yapass:sse] opening", streamUrl);
    const es = new EventSource(streamUrl);
    esRef.current = es;

    es.addEventListener("hello", (event) => {
      if (cancelled) return;
      console.debug("[yapass:sse] hello", (event as MessageEvent).data);
      dispatch({ type: "connect" });
    });

    es.addEventListener("campaign", (event) => {
      if (cancelled) return;
      try {
        const data = JSON.parse((event as MessageEvent).data) as Campaign;
        console.debug("[yapass:sse] campaign", data.id, data.title);
        // Extra defence: even if the backend ever replays an old event
        // on reconnect, we filter anything stale before dispatching.
        const createdAt = new Date(data.createdAt).getTime();
        if (
          Number.isFinite(createdAt) &&
          Date.now() - createdAt > CAMPAIGN_TTL_MS
        ) {
          return;
        }
        dispatch({ type: "append", campaign: data });
      } catch (err) {
        console.warn("[yapass:sse] bad frame", err);
      }
    });

    es.onerror = (event) => {
      // EventSource reconnects automatically; we just surface the blip
      // in state so the UI can show a connecting indicator.
      console.warn("[yapass:sse] error / reconnecting", event);
      if (!cancelled) dispatch({ type: "disconnect" });
    };

    return () => {
      cancelled = true;
      es.close();
      esRef.current = null;
    };
  }, [enabled, locationKey, radiusM]);

  const visible = state.campaigns.filter((c) => !state.dismissedIds.has(c.id));
  const latest = visible.length > 0 ? visible[0] : null;

  return {
    campaigns: visible,
    latest,
    connected: state.connected,
    error: state.error,
    dismiss: (id) => dispatch({ type: "dismiss", id }),
  };
}
