"use client";

import { useSyncExternalStore } from "react";
import { planWipe, tileSizeFor } from "./pixel-wipe";
import { THEME_COLOR, THEME_STORAGE_KEY, type Theme } from "./theme-boot";

/**
 * Global light/dark theme. The theme lives on <html data-theme>, which the inline
 * boot script in layout.tsx sets before first paint (saved choice, else the OS
 * preference). This module only changes it, persists it, and animates the change.
 */

export type { Theme };

const WIPE_MS = 850;

const listeners = new Set<() => void>();
/** The theme the user last asked for, while a transition toward it is still running. */
let pending: Theme | null = null;

function readTheme(): Theme {
  return document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark";
}

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  // Hover/color transitions would otherwise ease every link between the two themes.
  root.classList.add("theme-switching");
  requestAnimationFrame(() => requestAnimationFrame(() => root.classList.remove("theme-switching")));
  root.setAttribute("data-theme", theme);
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", THEME_COLOR[theme]);
  listeners.forEach((l) => l());
}

function persist(theme: Theme) {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    /* storage unavailable: the theme still applies for this visit */
  }
}

function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Reveal the new snapshot right-to-left in stepped pixel tiles. */
function runPixelWipe() {
  const width = document.documentElement.clientWidth;
  const height = window.innerHeight;
  const { frames } = planWipe({ width, height, tile: tileSizeFor(width) });
  const keyframes = frames.map((clipPath) => ({ clipPath, easing: "steps(1, end)" }));
  return document.documentElement.animate(keyframes, {
    duration: WIPE_MS,
    fill: "both",
    pseudoElement: "::view-transition-new(root)",
  });
}

export function setTheme(next: Theme) {
  persist(next);
  if (next === readTheme() && pending === null) return;
  pending = next;

  const startViewTransition = (document as Document & {
    startViewTransition?: (update: () => void) => { ready: Promise<void>; finished: Promise<void> };
  }).startViewTransition?.bind(document);

  // No animation for reduced motion or browsers without view transitions: switch instantly.
  if (!startViewTransition || prefersReducedMotion()) {
    applyTheme(next);
    pending = null;
    return;
  }

  // A new transition started mid-wipe makes the browser skip the old one to its end,
  // so rapid clicks always settle on the last theme requested.
  const transition = startViewTransition(() => applyTheme(next));
  transition.ready.then(runPixelWipe).catch(() => {});
  transition.finished
    .catch(() => {})
    .finally(() => {
      if (pending === next) pending = null;
    });
}

export function toggleTheme() {
  setTheme((pending ?? readTheme()) === "dark" ? "light" : "dark");
}

/** Follow OS changes only while the visitor hasn't picked a theme themselves. */
function watchSystemPreference() {
  const media = window.matchMedia("(prefers-color-scheme: light)");
  const onChange = () => {
    let saved: string | null = null;
    try {
      saved = localStorage.getItem(THEME_STORAGE_KEY);
    } catch {}
    if (saved !== "light" && saved !== "dark") applyTheme(media.matches ? "light" : "dark");
  };
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}

function subscribe(callback: () => void) {
  listeners.add(callback);
  const stopWatching = listeners.size === 1 ? watchSystemPreference() : undefined;
  return () => {
    listeners.delete(callback);
    stopWatching?.();
  };
}

/** Current theme for UI (the toggle icon). The server renders "dark"; the client corrects it after hydration. */
export function useTheme(): Theme {
  return useSyncExternalStore(subscribe, readTheme, () => "dark");
}
