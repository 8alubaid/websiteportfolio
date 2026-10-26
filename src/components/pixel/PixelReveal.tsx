"use client";

import { useEffect, useRef, useState, type ElementType, type ReactNode } from "react";

const FLASH_MS = 320;
const SPREAD_MS = 260;
const MAX_CELLS = 320;

interface Cell {
  delay: number;
}

/**
 * Pixel Reveal: when its content first scrolls into view, a grid of solid blocks
 * flashes on and off in discrete steps over it, then unmounts.
 *
 * The content itself is never hidden (it renders normally without JavaScript), and
 * the effect is skipped for `prefers-reduced-motion`. Total runtime is under 0.6 s.
 */
export function PixelReveal({
  children,
  as: Tag = "span",
  className,
  cell = 12,
}: {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  /** Block size in px. Grows automatically for large elements to cap the cell count. */
  cell?: number;
}) {
  const ref = useRef<HTMLElement>(null);
  const [grid, setGrid] = useState<{ cols: number; rows: number; cells: Cell[] } | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let timer: ReturnType<typeof setTimeout> | undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        const { width, height } = el.getBoundingClientRect();
        let size = cell;
        while (Math.ceil(width / size) * Math.ceil(height / size) > MAX_CELLS) size += 2;
        const cols = Math.max(1, Math.ceil(width / size));
        const rows = Math.max(1, Math.ceil(height / size));
        // Sweep roughly left to right, with jitter so it reads as pixels, not a wipe.
        const cells = Array.from({ length: cols * rows }, (_, i) => ({
          delay: Math.round(((i % cols) / cols) * SPREAD_MS * 0.7 + Math.random() * SPREAD_MS * 0.3),
        }));
        setGrid({ cols, rows, cells });
        timer = setTimeout(() => setGrid(null), FLASH_MS + SPREAD_MS + 50);
      },
      { threshold: 0.6 },
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      if (timer) clearTimeout(timer);
    };
  }, [cell]);

  return (
    <Tag ref={ref} className={`relative ${className ?? ""}`}>
      {children}
      {grid && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 grid"
          style={{ gridTemplateColumns: `repeat(${grid.cols}, 1fr)`, gridTemplateRows: `repeat(${grid.rows}, 1fr)` }}
        >
          {grid.cells.map((c, i) => (
            <span
              key={i}
              className="bg-fg"
              style={{ animation: `pixel-flash ${FLASH_MS}ms steps(1, end) ${c.delay}ms both` }}
            />
          ))}
        </span>
      )}
    </Tag>
  );
}
