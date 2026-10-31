"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { isSectorId, projectNumber, projects, sectorById, sectors } from "@/data";
import type { Project, SectorId } from "@/types/portfolio";
import { cn } from "@/lib/cn";

type Filter = SectorId | "all";

const pad = (n: number) => String(n).padStart(2, "0");

/** Detail preview beside the index on wide screens. Keyed per project by the caller so it re-enters with a pixel wipe. */
function Preview({ project }: { project: Project }) {
  const results = project.results?.slice(0, 3) ?? [];
  return (
    <div className="animate-pixel-wipe">
      <div className="flex items-baseline justify-between border-b border-surface pb-3 font-mono text-xs">
        <span>
          {projectNumber(project)} <span aria-hidden="true">/</span> {project.role}
        </span>
        <span>{project.period ?? ""}</span>
      </div>

      <h3 className="mt-6 font-display text-3xl font-semibold leading-tight tracking-tight">{project.title}</h3>
      <p className="mt-4 leading-relaxed">{project.summary}</p>

      <dl className="mt-8 grid gap-6 border-t border-surface pt-6 text-sm">
        <div className="grid gap-1.5 sm:grid-cols-[8rem_1fr]">
          <dt className="eyebrow pt-0.5">Overview</dt>
          <dd className="line-clamp-4 leading-relaxed">{project.recruiter.overview}</dd>
        </div>
        <div className="grid gap-1.5 sm:grid-cols-[8rem_1fr]">
          <dt className="eyebrow pt-0.5">Contribution</dt>
          <dd className="line-clamp-4 leading-relaxed">{project.recruiter.contribution}</dd>
        </div>
        <div className="grid gap-1.5 sm:grid-cols-[8rem_1fr]">
          <dt className="eyebrow pt-0.5">Stack</dt>
          <dd className="leading-relaxed">{project.stack.join(" / ")}</dd>
        </div>
      </dl>

      {results.length > 0 && (
        <dl className="mt-8 grid grid-cols-3 border-t border-surface pt-6">
          {results.map((r) => (
            <div key={r.label} className="pr-4">
              <dt className="font-mono text-xs">{r.label}</dt>
              <dd className="mt-1 font-display text-2xl font-semibold">{r.value}</dd>
            </div>
          ))}
        </dl>
      )}

      <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 font-mono text-sm">
        <Link href={`/projects/${project.slug}`} className="inverse px-4 py-2.5 transition-colors hover:bg-surface hover:text-on-surface">
          Open project →
        </Link>
        <Link
          href={`/terminal?run=${encodeURIComponent(`projects ${project.slug}`)}`}
          className="underline decoration-surface decoration-2 underline-offset-[6px] hover:decoration-fg"
        >
          View in terminal
        </Link>
      </div>
    </div>
  );
}

/**
 * Project index: numbered entries with a live detail preview. Hover or focus an
 * entry to preview it (a pixel indicator steps in); select it to open the project.
 * Without JavaScript (and as the Suspense fallback) it renders the unfiltered index.
 */
export function ProjectIndexView({ filter = "all", onFilter }: { filter?: Filter; onFilter?: (f: Filter) => void }) {
  const list = filter === "all" ? projects : projects.filter((p) => p.sectors.includes(filter));
  const [activeSlug, setActiveSlug] = useState(list[0]?.slug);
  const active = list.find((p) => p.slug === activeSlug) ?? list[0];

  const filters: { id: Filter; label: string; count: number }[] = [
    { id: "all", label: "All", count: projects.length },
    ...sectors.map((s) => ({ id: s.id, label: s.label, count: projects.filter((p) => p.sectors.includes(s.id)).length })),
  ];

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-6 border-b border-surface pb-4">
        <div role="group" aria-label="Filter projects by area" className="flex flex-wrap gap-1 font-mono text-xs">
          {filters.map((f) => (
            <button
              key={f.id}
              type="button"
              aria-pressed={filter === f.id}
              disabled={!onFilter}
              onClick={() => onFilter?.(f.id)}
              className={cn("px-3 py-1.5 uppercase tracking-[0.12em]", filter === f.id ? "inverse" : "hover:bg-surface hover:text-on-surface")}
            >
              {f.label} {pad(f.count)}
            </button>
          ))}
        </div>
        <p className="font-mono text-xs uppercase tracking-[0.12em]" aria-live="polite">
          {pad(list.length)} {list.length === 1 ? "project" : "projects"}
          {filter !== "all" && ` · ${sectorById[filter].label}`}
        </p>
      </div>

      <div className="mt-6 grid gap-x-16 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
        <ol>
          {list.map((p) => {
            const isActive = active?.slug === p.slug;
            return (
              <li key={p.slug}>
                <Link
                  href={`/projects/${p.slug}`}
                  onMouseEnter={() => setActiveSlug(p.slug)}
                  onFocus={() => setActiveSlug(p.slug)}
                  aria-describedby={`${p.slug}-discipline`}
                  className="group relative grid grid-cols-[3rem_1fr] gap-y-1 py-6 sm:grid-cols-[4.5rem_1fr_auto] sm:py-7"
                >
                  <span className="pt-2 font-mono text-sm">{projectNumber(p)}</span>
                  <span>
                    <span className="flex items-center">
                      <span className="pixel-indicator" data-active={isActive} aria-hidden="true" />
                      <span
                        className={cn(
                          "font-display text-[clamp(1.75rem,4vw,2.9rem)] font-semibold leading-[1.05] tracking-[-0.03em]",
                          isActive && "underline decoration-2 underline-offset-[10px]",
                        )}
                      >
                        {p.name}
                      </span>
                    </span>
                    <span id={`${p.slug}-discipline`} className="mt-2 block font-mono text-xs uppercase tracking-[0.14em]">
                      {p.discipline}
                    </span>
                    {/* Narrow screens have no preview pane, so show the summary inline. */}
                    <span className="mt-3 block max-w-prose text-sm leading-relaxed lg:hidden">{p.summary}</span>
                  </span>
                  <span className="col-start-2 font-mono text-xs sm:col-start-auto sm:pt-3 sm:text-right">{p.period ?? ""}</span>
                  {/* Divider: charcoal at rest, steps to full white on the active entry. */}
                  <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-px bg-surface" />
                  <span
                    aria-hidden="true"
                    className={cn(
                      "absolute bottom-0 left-0 h-px w-full origin-left bg-fg transition-transform duration-300 [transition-timing-function:steps(8,end)]",
                      isActive ? "scale-x-100" : "scale-x-0",
                    )}
                  />
                </Link>
              </li>
            );
          })}
        </ol>

        <aside aria-label="Project preview" className="hidden lg:block">
          <div className="sticky top-24 pt-6">{active && <Preview key={active.slug} project={active} />}</div>
        </aside>
      </div>
    </div>
  );
}

/** Interactive index whose area filter lives in the URL (`?sector=ai`), so filtered views are shareable. */
export function ProjectIndex() {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const raw = params.get("sector") ?? "";
  const filter: Filter = isSectorId(raw) ? raw : "all";

  const onFilter = (next: Filter) => {
    const search = next === "all" ? "" : `?sector=${next}`;
    router.replace(`${pathname}${search}#projects`, { scroll: false });
  };

  return <ProjectIndexView key={filter} filter={filter} onFilter={onFilter} />;
}
