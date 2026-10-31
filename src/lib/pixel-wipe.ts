/**
 * Geometry for the theme-switch pixel wipe. Pure functions, no DOM.
 *
 * The incoming theme is revealed from the RIGHT edge toward the LEFT in whole square
 * tiles. Each tile row trails the main front by a small, smoothly varying number of
 * columns, which turns the advancing edge into an irregular staircase of pixels while
 * the overall motion stays clearly right-to-left. Each frame is a clip-path polygon
 * covering the revealed region; the caller holds each frame (steps easing), so the
 * edge jumps a tile at a time instead of gliding.
 */

export interface WipeOptions {
  width: number;
  height: number;
  /** Tile edge in CSS px. */
  tile: number;
  /** How many columns a row may lag behind the front. */
  maxLag?: number;
  /** Random source in [0, 1). Injectable for tests. */
  random?: () => number;
}

export interface WipePlan {
  cols: number;
  rows: number;
  /** Per-row lag, in columns. */
  lag: number[];
  /** clip-path values, from nothing revealed to everything revealed. */
  frames: string[];
}

/** Tile size: chunkier on large screens, finer on phones. */
export function tileSizeFor(width: number): number {
  if (width < 640) return 32;
  if (width < 1280) return 44;
  return 56;
}

/** A smoothed random walk: neighbouring rows differ by at most one column, so the edge looks organic, not noisy. */
export function rowLags(rows: number, maxLag: number, random: () => number): number[] {
  const lag: number[] = [];
  let current = Math.floor(random() * (maxLag + 1));
  for (let r = 0; r < rows; r++) {
    const step = Math.floor(random() * 3) - 1; // -1, 0 or +1
    current = Math.min(maxLag, Math.max(0, current + step));
    lag.push(current);
  }
  return lag;
}

/** Revealed columns per row at step `s` (counted from the right edge). */
export function revealedColumns(step: number, lag: number[], cols: number): number[] {
  return lag.map((l) => Math.min(cols, Math.max(0, step - l)));
}

export function planWipe({ width, height, tile, maxLag = 4, random = Math.random }: WipeOptions): WipePlan {
  // One extra column and row so the revealed area always overshoots the viewport edge.
  const cols = Math.ceil(width / tile) + 1;
  const rows = Math.ceil(height / tile) + 1;
  const lag = rowLags(rows, maxLag, random);
  const right = cols * tile;
  const bottom = rows * tile;
  const steps = cols + maxLag;

  const frames: string[] = [];
  for (let s = 0; s <= steps; s++) {
    const revealed = revealedColumns(s, lag, cols);
    // Trace the staircase: top-right, down the jagged left boundary row by row, bottom-right.
    const points: string[] = [`${right}px 0px`];
    revealed.forEach((n, r) => {
      // Fully revealed rows reach past the left edge so no sliver of the old theme survives.
      const x = n >= cols ? -tile : right - n * tile;
      points.push(`${x}px ${r * tile}px`, `${x}px ${(r + 1) * tile}px`);
    });
    points.push(`${right}px ${bottom}px`);
    frames.push(`polygon(${points.join(", ")})`);
  }
  return { cols, rows, lag, frames };
}
