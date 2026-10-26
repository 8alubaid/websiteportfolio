/**
 * 5×7 bitmap glyphs for the signature mark. `1` is a filled pixel.
 * Edit these (or add letters) to change the mark; PixelMark lays them out
 * with a one-column gap. To use artwork from Aseprite or Piskel instead,
 * see "Pixel art assets" in the README.
 */
export const glyphs: Record<string, string[]> = {
  F: ["11111", "10000", "10000", "11110", "10000", "10000", "10000"],
  B: ["11110", "10001", "10001", "11110", "10001", "10001", "11110"],
};

/** Deterministic PRNG so server and client render identical animation delays. */
export function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
