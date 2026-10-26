"use client";

import { useSyncExternalStore } from "react";

/**
 * Remembers which project the visitor is looking at, in either mode, so the mode
 * switcher can carry that context across. Session-scoped, no personal data.
 */
const KEY = "fb:focus-project";
let focus: string | undefined;
const listeners = new Set<() => void>();

function read(): string | undefined {
  if (focus === undefined && typeof window !== "undefined") {
    try {
      focus = sessionStorage.getItem(KEY) ?? undefined;
    } catch {
      /* storage unavailable */
    }
  }
  return focus;
}

export function setFocusProject(slug: string | undefined) {
  if (slug === focus) return;
  focus = slug;
  try {
    if (slug) sessionStorage.setItem(KEY, slug);
    else sessionStorage.removeItem(KEY);
  } catch {
    /* storage unavailable */
  }
  listeners.forEach((l) => l());
}

export function getFocusProject() {
  return read();
}

export function useFocusProject(): string | undefined {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    read,
    () => undefined,
  );
}
