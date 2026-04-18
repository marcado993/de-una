"use client";

import { useCallback, useEffect, useReducer, useRef } from "react";

export type GeolocationStatus =
  /** Hook has not yet requested a position (e.g. `enabled = false`). */
  | "idle"
  /** Browser is resolving the permission prompt or reading the GPS. */
  | "loading"
  /** We have a fresh position. */
  | "granted"
  /** User explicitly denied the browser permission. */
  | "denied"
  /** Geolocation API is not available on this browser. */
  | "unavailable"
  /** Timeout, position-unavailable, or any other runtime failure. */
  | "error";

export type GeolocationState = {
  status: GeolocationStatus;
  position: { lat: number; lng: number } | null;
  /** Radius in meters that represents the 68% confidence interval. */
  accuracy: number | null;
  error: string | null;
};

export type UseGeolocationOptions = {
  /**
   * If false the hook stays in `"idle"` and does not prompt the user.
   * Typical pattern: set to `modalVisible` so we only ask when needed.
   */
  enabled?: boolean;
  /** Max age of an internally-cached position in ms. Default 60_000. */
  maximumAge?: number;
  /** Request timeout in ms. Default 10_000. */
  timeout?: number;
  /** High accuracy trades battery for precision. Default true. */
  highAccuracy?: boolean;
  /** When true, continuously updates `position` as the user moves. */
  watch?: boolean;
};

const INITIAL_STATE: GeolocationState = {
  status: "idle",
  position: null,
  accuracy: null,
  error: null,
};

type Action =
  | { type: "start" }
  | {
      type: "success";
      position: { lat: number; lng: number };
      accuracy: number | null;
    }
  | { type: "fail"; status: "denied" | "unavailable" | "error"; error: string };

function reducer(state: GeolocationState, action: Action): GeolocationState {
  switch (action.type) {
    case "start":
      return { ...state, status: "loading", error: null };
    case "success":
      return {
        status: "granted",
        position: action.position,
        accuracy: action.accuracy,
        error: null,
      };
    case "fail":
      return {
        status: action.status,
        position: null,
        accuracy: null,
        error: action.error,
      };
    default:
      return state;
  }
}

/**
 * React hook wrapping `navigator.geolocation`. Handles SSR safety,
 * permission-denied vs other errors, and supports both one-shot and
 * watch modes.
 *
 * Usage:
 *   const geo = useGeolocation({ enabled: modalVisible });
 *   const center = geo.position ?? fallbackCenter;
 *
 * State transitions are driven through a reducer so we can dispatch
 * actions freely from effects and async callbacks without tripping the
 * "setState in effect" lint rule.
 */
export function useGeolocation({
  enabled = true,
  maximumAge = 60_000,
  timeout = 10_000,
  highAccuracy = true,
  watch = false,
}: UseGeolocationOptions = {}): GeolocationState & { refresh: () => void } {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);
  const watchIdRef = useRef<number | null>(null);

  const request = useCallback(() => {
    if (typeof window === "undefined" || !("geolocation" in navigator)) {
      dispatch({
        type: "fail",
        status: "unavailable",
        error: "La API de Geolocalización no está disponible.",
      });
      return;
    }

    dispatch({ type: "start" });

    const opts: PositionOptions = {
      enableHighAccuracy: highAccuracy,
      maximumAge,
      timeout,
    };

    const onSuccess = (pos: GeolocationPosition) => {
      dispatch({
        type: "success",
        position: { lat: pos.coords.latitude, lng: pos.coords.longitude },
        accuracy: pos.coords.accuracy,
      });
    };

    const onError = (err: GeolocationPositionError) => {
      const denied = err.code === err.PERMISSION_DENIED;
      dispatch({
        type: "fail",
        status: denied ? "denied" : "error",
        error: err.message || "No pudimos obtener tu ubicación.",
      });
    };

    if (watch) {
      watchIdRef.current = navigator.geolocation.watchPosition(
        onSuccess,
        onError,
        opts,
      );
    } else {
      navigator.geolocation.getCurrentPosition(onSuccess, onError, opts);
    }
  }, [highAccuracy, maximumAge, timeout, watch]);

  useEffect(() => {
    const clearWatchSafely = () => {
      if (watchIdRef.current != null && typeof navigator !== "undefined") {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
    };

    if (!enabled) {
      clearWatchSafely();
      return;
    }

    request();
    return clearWatchSafely;
  }, [enabled, request]);

  // When disabled we surface the idle snapshot without touching internal
  // state. On re-enable, `request()` transitions to "loading" immediately,
  // so any stale value from a previous session is overwritten within a tick.
  const view = enabled ? state : INITIAL_STATE;
  return { ...view, refresh: request };
}
