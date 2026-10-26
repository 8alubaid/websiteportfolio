"use client";

import Image, { type StaticImageData } from "next/image";
import { useState } from "react";
import { cn } from "@/lib/cn";

interface Shot {
  src: StaticImageData;
  alt: string;
}

interface View {
  id: string;
  label: string;
  before: Shot;
  after: Shot;
}

/**
 * Before/after viewer: the "after" screenshot sits on top of the "before" one and is
 * clipped at the divider, so dragging it reveals either site. The divider is a native
 * range input stretched over the frame: click or drag anywhere, or use the arrow keys.
 */
export function SplitCompare({
  views,
  beforeLabel,
  afterLabel,
  shortLabels = ["Before", "After"],
}: {
  views: View[];
  beforeLabel: string;
  afterLabel: string;
  /** Shown instead of the full labels on narrow screens, where both wouldn't fit. */
  shortLabels?: [string, string];
}) {
  const [viewId, setViewId] = useState(views[0].id);
  const [position, setPosition] = useState(50);
  const view = views.find((v) => v.id === viewId) ?? views[0];

  return (
    <div>
      <div role="group" aria-label="Screen size" className="mb-6 flex gap-1 font-mono text-xs">
        {views.map((v) => (
          <button
            key={v.id}
            type="button"
            aria-pressed={v.id === viewId}
            onClick={() => setViewId(v.id)}
            className={cn("px-3 py-1.5 uppercase tracking-[0.12em]", v.id === viewId ? "inverse" : "hover:bg-surface")}
          >
            {v.label}
          </button>
        ))}
      </div>

      <figure className={cn("mx-auto", view.id === "phone" ? "max-w-[390px]" : "max-w-none")}>
        <div className="relative select-none overflow-hidden border border-surface">
          {/* Before: full frame underneath. */}
          <Image src={view.before.src} alt={view.before.alt} className="block h-auto w-full" priority sizes="(max-width: 1440px) 100vw, 1440px" />
          {/* After: same frame on top, clipped to the right of the divider. */}
          <div className="absolute inset-0" style={{ clipPath: `inset(0 0 0 ${position}%)` }}>
            <Image src={view.after.src} alt={view.after.alt} className="block h-auto w-full" priority sizes="(max-width: 1440px) 100vw, 1440px" />
          </div>

          {/* Divider and handle. */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 w-0.5 -translate-x-1/2 bg-fg" style={{ left: `${position}%` }}>
            <span className="inverse absolute left-1/2 top-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center font-mono text-xs">
              ◀▶
            </span>
          </div>

          <span className="inverse pointer-events-none absolute left-2 top-2 px-2 py-1 font-mono text-[0.65rem] uppercase tracking-[0.12em]">
            <span className="sm:hidden">{shortLabels[0]}</span>
            <span className="hidden sm:inline">{beforeLabel}</span>
          </span>
          <span className="inverse pointer-events-none absolute right-2 top-2 px-2 py-1 font-mono text-[0.65rem] uppercase tracking-[0.12em]">
            <span className="sm:hidden">{shortLabels[1]}</span>
            <span className="hidden sm:inline">{afterLabel}</span>
          </span>

          <input
            type="range"
            min={0}
            max={100}
            step={1}
            value={position}
            onChange={(e) => setPosition(Number(e.target.value))}
            aria-label={`Divider: ${beforeLabel} on the left, ${afterLabel} on the right`}
            aria-valuetext={`${position}% ${beforeLabel}`}
            className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
          />
        </div>
        <figcaption className="mt-3 font-mono text-xs">Drag the divider (or focus it and use the arrow keys) to cut between the two sites.</figcaption>
      </figure>
    </div>
  );
}
