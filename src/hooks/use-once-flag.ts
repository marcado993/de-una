"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * Module-level pub/sub so a `markSeen()` call in one hook instance
 * wakes up every other mounted instance of the same key. The native
 * `storage` event only fires for *other* tabs, so we layer our own
 * in-tab bus on top.
 */
const listeners = new Set<() => void>();
function notify() {
  for (const l of listeners) l();
}

function subscribe(callback: () => void) {
  listeners.add(callback);
  const onStorage = () => callback();
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(callback);
    window.removeEventListener("storage", onStorage);
  };
}

/** Sentinel returned during SSR / first render so we can distinguish
 * "no value yet loaded" from "value is empty". */
const SSR = Symbol("ssr");
type Flag = string | null | typeof SSR;

function readFlag(key: string): Flag {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

/**
 * Tracks a boolean "seen" flag in `localStorage` so a given piece of
 * UI only appears the first time a user opens the app. Web equivalent
 * of the original AsyncStorage-based hook from the Expo project.
 *
 * Returns `[shouldShow, markSeen, reset]`:
 *  - `shouldShow` is `null` during SSR / before hydration, `true` if
 *    the user has never marked the flag as seen, `false` once marked.
 *  - `markSeen()` persists the flag and flips `shouldShow` to `false`.
 *  - `reset()` clears the flag (useful for debugging / QA).
 */
export function useOnceFlag(key: string) {
  const getSnapshot = useCallback(() => readFlag(key), [key]);
  const getServerSnapshot = useCallback((): Flag => SSR, []);

  const value = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const shouldShow: boolean | null =
    value === SSR ? null : value !== "seen";

  const markSeen = useCallback(() => {
    try {
      window.localStorage.setItem(key, "seen");
    } catch {
      // no-op: worst case we show the popup again next launch
    }
    notify();
  }, [key]);

  const reset = useCallback(() => {
    try {
      window.localStorage.removeItem(key);
    } catch {
      // no-op
    }
    notify();
  }, [key]);

  return [shouldShow, markSeen, reset] as const;
}
