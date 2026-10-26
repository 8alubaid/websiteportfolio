import { glyphs, mulberry32 } from "./glyphs";

const GLYPH_W = 5;
const GLYPH_H = 7;

/**
 * Signature animation: the initials assemble from single pixels, top to bottom with
 * jitter, over a charcoal offset "shadow" that lands first. Pure SVG + CSS steps(),
 * so it renders on the server, costs no JavaScript, and ends in a static mark.
 * Reduced-motion users see the finished mark immediately (global CSS rule).
 */
export function PixelMark({ text = "FB", className }: { text?: string; className?: string }) {
  const letters = [...text.toUpperCase()].filter((c) => glyphs[c]);
  const width = letters.length * GLYPH_W + (letters.length - 1);
  const rand = mulberry32(7);

  const pixels: { x: number; y: number }[] = [];
  letters.forEach((letter, li) => {
    glyphs[letter].forEach((row, y) =>
      [...row].forEach((bit, x) => {
        if (bit === "1") pixels.push({ x: li * (GLYPH_W + 1) + x, y });
      }),
    );
  });

  const timed = pixels.map((p) => ({ ...p, delay: Math.round(p.y * 70 + rand() * 260) }));

  return (
    <svg
      viewBox={`0 0 ${width + 1} ${GLYPH_H + 1}`}
      className={className}
      shapeRendering="crispEdges"
      aria-hidden="true"
    >
      {timed.map((p, i) => (
        <rect
          key={`s${i}`}
          x={p.x + 1}
          y={p.y + 1}
          width={1}
          height={1}
          className="fill-surface"
          style={{ animation: `pixel-in 1ms steps(1, end) ${p.delay}ms both` }}
        />
      ))}
      {timed.map((p, i) => (
        <rect
          key={`f${i}`}
          x={p.x}
          y={p.y}
          width={1}
          height={1}
          className="fill-fg"
          style={{ animation: `pixel-in 1ms steps(1, end) ${p.delay + 180}ms both` }}
        />
      ))}
    </svg>
  );
}
