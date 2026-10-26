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

const sources = files(ROOT).map((path) => ({ path: relative(ROOT, path), text: readFileSync(path, "utf8") }));

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
});
