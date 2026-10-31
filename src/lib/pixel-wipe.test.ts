import { describe, expect, it } from "vitest";
import { planWipe, revealedColumns, rowLags, tileSizeFor } from "./pixel-wipe";

/** Deterministic PRNG so the irregular edge is reproducible. */
function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

/** Polygon points as [x, y] pairs. */
function points(frame: string): number[][] {
  return frame
    .replace(/^polygon\(|\)$/g, "")
    .split(", ")
    .map((p) => p.split(" ").map((v) => parseFloat(v)));
}

/** Left boundary x per row: points come as top-right, then two per row, then bottom-right. */
function leftEdges(frame: string): number[] {
  const pts = points(frame).slice(1, -1);
  return pts.filter((_, i) => i % 2 === 0).map(([x]) => x);
}

describe("pixel wipe geometry", () => {
  const opts = { width: 1440, height: 900, tile: 56, random: seeded(7) };
  const plan = planWipe(opts);

  it("uses square tiles in the 32-64px range", () => {
    for (const w of [320, 390, 768, 1024, 1440, 2560]) {
      const t = tileSizeFor(w);
      expect(t).toBeGreaterThanOrEqual(32);
      expect(t).toBeLessThanOrEqual(64);
    }
  });

  it("covers the viewport with whole tiles", () => {
    expect(plan.cols * opts.tile).toBeGreaterThanOrEqual(opts.width);
    expect(plan.rows * opts.tile).toBeGreaterThanOrEqual(opts.height);
  });

  it("starts with nothing of the new theme revealed", () => {
    // Every row's left edge sits on the right edge: a zero-width region.
    expect(new Set(leftEdges(plan.frames[0]))).toEqual(new Set([plan.cols * opts.tile]));
  });

  it("ends with the whole viewport revealed", () => {
    const last = plan.frames.at(-1)!;
    expect(leftEdges(last).every((x) => x < 0)).toBe(true);
    const ys = points(last).map(([, y]) => y);
    expect(Math.max(...ys)).toBeGreaterThanOrEqual(opts.height);
  });

  it("moves right to left only: no row ever retreats", () => {
    for (let f = 1; f < plan.frames.length; f++) {
      const prev = leftEdges(plan.frames[f - 1]);
      const next = leftEdges(plan.frames[f]);
      next.forEach((x, r) => expect(x).toBeLessThanOrEqual(prev[r]));
    }
  });

  it("snaps every edge to the tile grid", () => {
    for (const frame of plan.frames) {
      for (const [x, y] of points(frame)) {
        expect(Math.abs(x % opts.tile)).toBe(0);
        expect(Math.abs(y % opts.tile)).toBe(0);
      }
    }
  });

  it("gives rows an irregular but smooth offset", () => {
    const lag = rowLags(200, 4, seeded(3));
    expect(Math.min(...lag)).toBeGreaterThanOrEqual(0);
    expect(Math.max(...lag)).toBeLessThanOrEqual(4);
    expect(new Set(lag).size).toBeGreaterThan(1);
    lag.slice(1).forEach((l, i) => expect(Math.abs(l - lag[i])).toBeLessThanOrEqual(1));
  });

  it("clamps revealed columns to the grid", () => {
    expect(revealedColumns(0, [0, 2], 10)).toEqual([0, 0]);
    expect(revealedColumns(5, [0, 2], 10)).toEqual([5, 3]);
    expect(revealedColumns(99, [0, 2], 10)).toEqual([10, 10]);
  });
});
