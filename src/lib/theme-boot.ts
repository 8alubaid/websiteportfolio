/**
 * Shared by the server layout (boot script) and the client theme store.
 * Kept out of the "use client" module so the server can import plain values from it.
 */

export type Theme = "light" | "dark";

export const THEME_STORAGE_KEY = "fb:theme";

/** Browser chrome color per theme (the page background). */
export const THEME_COLOR: Record<Theme, string> = { dark: "#0b0b0b", light: "#f2f2f0" };

/**
 * Runs in <head> before the page renders, so the first paint already has the right
 * theme: the saved choice, else the OS preference, else dark.
 */
export const themeBootScript = `(function(){var d=document.documentElement,t="dark";try{t=localStorage.getItem("${THEME_STORAGE_KEY}");if(t!=="light"&&t!=="dark"){t=matchMedia("(prefers-color-scheme: light)").matches?"light":"dark"}}catch(e){t="dark"}d.setAttribute("data-theme",t);var m=document.querySelector('meta[name="theme-color"]');if(m)m.setAttribute("content",t==="light"?"${THEME_COLOR.light}":"${THEME_COLOR.dark}")})();`;
