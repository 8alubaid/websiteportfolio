"use client";

import { useEffect, useState } from "react";
import { sections } from "@/data/site";
import { cn } from "@/lib/cn";

/**
 * Side-mounted section indicator for wide screens: a thin vertical scale with
 * numbered stops. The current section gets a pixel marker; labels reveal on hover.
 */
export function SectionRail() {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const targets = sections.map((s) => document.getElementById(s.id)).filter((el): el is HTMLElement => !!el);
    const observer = new IntersectionObserver(
      (items) => {
        const visible = items.filter((i) => i.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );
    targets.forEach((t) => observer.observe(t));
    const top = document.getElementById("top");
    const topObserver = new IntersectionObserver(([e]) => e.isIntersecting && setActive(null), { threshold: 0.4 });
    if (top) topObserver.observe(top);
    return () => {
      observer.disconnect();
      topObserver.disconnect();
    };
  }, []);

  return (
    <nav
      aria-label="Sections"
      className={cn(
        "fixed left-6 top-1/2 z-30 hidden -translate-y-1/2 2xl:block",
        active ? "visible" : "invisible",
      )}
    >
      <ol className="relative border-l border-surface">
        {sections.map((s, i) => {
          const current = active === s.id;
          return (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                aria-current={current ? "location" : undefined}
                tabIndex={active ? 0 : -1}
                className="group relative flex items-center gap-3 py-2.5 pl-4 font-mono text-[0.68rem]"
              >
                <span aria-hidden="true" className={cn("absolute -left-[3px] size-1.5", current ? "bg-fg" : "bg-transparent")} />
                <span className={cn(current && "font-bold")}>{String(i + 1).padStart(2, "0")}</span>
                {/* Labels reveal on hover/focus only, so the rail never overlaps content. */}
                <span className="hidden whitespace-nowrap bg-bg px-1.5 tracking-[0.14em] group-hover:inline group-focus-visible:inline">
                  {s.label.toUpperCase()}
                </span>
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
