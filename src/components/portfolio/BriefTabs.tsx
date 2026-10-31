"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { cn } from "@/lib/cn";

interface Tab {
  id: string;
  label: string;
  hint: string;
  content: ReactNode;
}

/**
 * Accessible tabs (WAI-ARIA pattern) switching between the recruiter overview
 * and the engineering deep dive. `#engineering` in the URL opens the second tab.
 */
export function BriefTabs({ tabs }: { tabs: Tab[] }) {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const base = useId();

  useEffect(() => {
    const index = tabs.findIndex((t) => `#${t.id}` === window.location.hash);
    // Sync from the URL hash once on mount; the server always renders the first tab.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (index > 0) setActive(index);
  }, [tabs]);

  const select = (i: number, focus = false) => {
    setActive(i);
    history.replaceState(null, "", i === 0 ? window.location.pathname : `#${tabs[i].id}`);
    if (focus) refs.current[i]?.focus();
  };

  const onKeyDown = (e: KeyboardEvent) => {
    const last = tabs.length - 1;
    const next = { ArrowRight: active === last ? 0 : active + 1, ArrowLeft: active === 0 ? last : active - 1, Home: 0, End: last }[e.key];
    if (next !== undefined) {
      e.preventDefault();
      select(next, true);
    }
  };

  return (
    <div>
      <div role="tablist" aria-label="Brief type" className="flex gap-1 border-b border-surface" onKeyDown={onKeyDown}>
        {tabs.map((t, i) => (
          <button
            key={t.id}
            ref={(el) => {
              refs.current[i] = el;
            }}
            id={`${base}-tab-${t.id}`}
            role="tab"
            type="button"
            aria-selected={active === i}
            aria-controls={`${base}-panel-${t.id}`}
            tabIndex={active === i ? 0 : -1}
            onClick={() => select(i)}
            className={cn(
              "px-4 py-3 text-left transition-colors",
              active === i ? "inverse" : "hover:bg-surface hover:text-on-surface",
            )}
          >
            <span className="mr-2 font-mono text-xs">{String(i + 1).padStart(2, "0")}</span>
            <span className="font-medium">{t.label}</span>
            <span className="ml-3 hidden font-mono text-xs sm:inline">{t.hint}</span>
          </button>
        ))}
      </div>

      {tabs.map((t, i) => (
        <div
          key={t.id}
          id={`${base}-panel-${t.id}`}
          role="tabpanel"
          aria-labelledby={`${base}-tab-${t.id}`}
          hidden={active !== i}
          tabIndex={0}
          className="mt-10 animate-pixel-wipe focus-visible:outline-offset-8"
        >
          {t.content}
        </div>
      ))}
    </div>
  );
}
