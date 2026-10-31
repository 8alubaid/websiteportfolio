"use client";

import { toggleTheme, useTheme } from "@/lib/theme";

// 9×9 pixel bitmaps. Sun = "switch to light", moon = "switch to dark".
const SUN = [
  "....#....",
  ".#.....#.",
  "...###...",
  "..#####..",
  "#.#####.#",
  "..#####..",
  "...###...",
  ".#.....#.",
  "....#....",
];
const MOON = [
  "..#####..",
  ".###.....",
  ".##......",
  "###......",
  "###......",
  "###......",
  ".##......",
  ".###.....",
  "..#####..",
];

/** One rect per horizontal run of lit pixels. */
function PixelIcon({ rows }: { rows: string[] }) {
  const rects = rows.flatMap((row, y) =>
    [...row.matchAll(/#+/g)].map((m) => <rect key={`${y}-${m.index}`} x={m.index} y={y} width={m[0].length} height={1} />),
  );
  return (
    <svg viewBox="0 0 9 9" width={14} height={14} aria-hidden="true" fill="currentColor" shapeRendering="crispEdges">
      {rects}
    </svg>
  );
}

export function ThemeToggle() {
  const theme = useTheme();
  const label = theme === "dark" ? "Switch to light mode" : "Switch to dark mode";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={label}
      title={label}
      className="grid size-8 place-items-center text-muted transition-colors duration-200 hover:text-fg"
    >
      <PixelIcon rows={theme === "dark" ? SUN : MOON} />
    </button>
  );
}
