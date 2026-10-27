import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { describe, expect, it } from "vitest";

/**
 * Guards the three-color design system: #0B0B0B (bg), #F2F2F0 (fg), #242424 (surface).
 * Fails if any source file introduces another color value, a gradient, or a color class.
 */
const ROOT = join(__dirname, "..");
const ALLOWED_HEX = new Set(["0b0b0b", "f2f2f0", "242424"]);

function files(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return files(path);
    return /\.(tsx?|css|svg)$/.test(name) && !name.endsWith(".test.ts") ? [path] : [];
  });
}

/**
 * The one deliberate exception: /compare/ shows the weaker prompts in the style of the
 * old site (farisbalubaid.cloud). That file may use the old site's palette and nothing else.
 */
const LEGACY_FILE = join("styles", "legacy-farisbalubaid.css");
const LEGACY_HEX = new Set(["09090f", "111118", "1e1e2e", "d6b840", "f0e2a0", "e2e2f0", "8a8aa8"]);

const all = files(ROOT).map((path) => ({ path: relative(ROOT, path), text: readFileSync(path, "utf8") }));
const sources = all.filter((s) => s.path !== LEGACY_FILE);
const legacy = all.find((s) => s.path === LEGACY_FILE);

// Tailwind's default palette plus the retired space-theme tokens.
const BANNED_COLOR_WORDS =
  "slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|black|white|space|navy|raised|signal|cosmic|ok|alert|ink|dim|line";
const COLOR_CLASS = new RegExp(
  `\\b(?:text|bg|border(?:-[tblrxy])?|outline|ring|fill|stroke|decoration|caret|divide|from|via|to|shadow|accent|placeholder)-(?:${BANNED_COLOR_WORDS})(?:-\\d{2,3})?(?:\\/\\d+)?\\b`,
);

describe("three-color design system", () => {
  it("uses only the three approved hex values", () => {
    const offenders = sources.flatMap(({ path, text }) =>
      [...text.matchAll(/#([0-9a-f]{3,8})\b/gi)].map((m) => m[1].toLowerCase()).filter((hex) => !ALLOWED_HEX.has(hex)).map((hex) => `${path}: #${hex}`),
    );
    expect(offenders).toEqual([]);
  });

  it("has no rgb/hsl/oklch colors or gradients", () => {
    const offenders = sources.filter(({ text }) => /\b(rgba?|hsla?|oklch)\(|gradient\(/i.test(text)).map(({ path }) => path);
    expect(offenders).toEqual([]);
  });

  it("has no Tailwind palette or retired color classes", () => {
    const offenders = sources.flatMap(({ path, text }) => {
      const m = text.match(COLOR_CLASS);
      return m ? [`${path}: ${m[0]}`] : [];
    });
    expect(offenders).toEqual([]);
  });

  it("confines the old site's palette to its one stylesheet, using only its real values", () => {
    expect(legacy).toBeDefined();
    const hexes = [...legacy!.text.matchAll(/#([0-9a-f]{3,8})\b/gi)].map((m) => m[1].toLowerCase());
    expect(hexes.filter((h) => !LEGACY_HEX.has(h))).toEqual([]);
    // Its rgba() tints must be built from the old accent color only.
    const rgbaCalls = legacy!.text.match(/rgba?\(/gi)?.length ?? 0;
    const accentTints = legacy!.text.match(/rgba\(var\(--legacy-accent-rgb\),\s*[\d.]+\)/g)?.length ?? 0;
    expect(accentTints).toBe(rgbaCalls);
    expect(legacy!.text).not.toMatch(/gradient\(/i);
    // Only the compare page may import it.
    const importers = sources.filter((s) => s.text.includes("legacy-farisbalubaid.css")).map((s) => s.path);
    expect(importers).toEqual([join("app", "compare", "page.tsx")]);
  });
});
