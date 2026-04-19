"use client";

import { useSyncExternalStore } from "react";

import { fetchMe, type Identity } from "@/lib/api";

/**
 * Placeholder identity shown while `fetchMe()` is in flight. Chosen
 * so the header still renders two characters (avoids layout jumps)
 * without pretending to be a real name.
 */
const LOADING_IDENTITY: Identity = {
  id: "loading",
  name: "…",
  initials: "··",
};

/**
 * Fallback used when the API is unreachable. Keeps the UI readable
 * offline and avoids confusing placeholder dots once we know there
 * won't be a real answer.
 */
const OFFLINE_IDENTITY: Identity = {
  id: "offline",
  name: "Amigx",
  initials: "A·",
};

// Module-level cache so every mounted <ScreenHeader /> (and anything
// else that consumes useMe) shares the same result without re-fetching.
// useSyncExternalStore keeps it SSR-safe: the server snapshot always
// returns LOADING_IDENTITY so hydration never mismatches on first paint.
let cachedIdentity: Identity = LOADING_IDENTITY;
let inflight: Promise<Identity> | null = null;
const listeners = new Set<() => void>();

function setIdentity(next: Identity): void {
  if (
    cachedIdentity.id === next.id &&
    cachedIdentity.name === next.name &&
    cachedIdentity.initials === next.initials
  ) {
    return;
  }
  cachedIdentity = next;
  listeners.forEach((l) => l());
}

function ensureFetched(): void {
  if (typeof window === "undefined") return;
  if (cachedIdentity.id !== "loading") return;
  if (inflight) return;
  inflight = fetchMe()
    .then((id) => {
      setIdentity(id);
      return id;
    })
    .catch(() => {
      setIdentity(OFFLINE_IDENTITY);
      return OFFLINE_IDENTITY;
    })
    .finally(() => {
      inflight = null;
    });
}

function subscribe(listener: () => void): () => void {
  // Kick the fetch lazily on first subscriber so SSR output stays
  // deterministic. Subsequent renders just reuse the cache.
  ensureFetched();
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot(): Identity {
  return cachedIdentity;
}

function getServerSnapshot(): Identity {
  return LOADING_IDENTITY;
}

/**
 * Subscribes to the shared {@link Identity} that `deuna-api` resolves
 * per visitor IP. Returns a loading placeholder during the first
 * request, an offline fallback if the API can't be reached, and the
 * real identity once the fetch resolves.
 */
export function useMe(): Identity {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
