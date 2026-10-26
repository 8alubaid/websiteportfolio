import Link from "next/link";
import { logKindLabel, timeline } from "@/data";
import type { LogKind } from "@/types/portfolio";
import { cn } from "@/lib/cn";

/** Employment is the only kind shown inverted, so it can never be mistaken for projects or training. */
const badge = (kind: LogKind) =>
  cn("inline-flex w-fit border px-2 py-0.5 font-mono text-[0.7rem] uppercase tracking-wider", kind === "employment" ? "inverse border-fg" : "border-fg");

export function Experience() {
  const kinds = [...new Set(timeline.map((e) => e.kind))];

  return (
    <div className="grid gap-8 lg:grid-cols-[14rem_1fr]">
      <aside>
        <p className="eyebrow mb-3">Entry types</p>
        <ul className="flex flex-wrap gap-2 lg:flex-col">
          {kinds.map((k) => (
            <li key={k} className={badge(k)}>
              {logKindLabel[k]}
            </li>
          ))}
        </ul>
        {!kinds.includes("employment") && (
          <p className="mt-4 text-xs leading-relaxed">Projects and training are labelled separately so they&apos;re never confused with employment.</p>
        )}
      </aside>

      <ol className="relative border-l border-surface pl-6 sm:pl-8">
        {timeline.map((e) => (
          <li key={e.id} className="relative pb-8 last:pb-0">
            <span className="absolute -left-[1.85rem] top-2 size-2.5 bg-fg sm:-left-[2.35rem]" aria-hidden="true" />
            <div className="panel p-5">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <span className={badge(e.kind)}>{logKindLabel[e.kind]}</span>
                <time className="font-mono text-xs">{e.period}</time>
              </div>
              <h3 className="mt-3 text-lg font-semibold leading-snug">{e.title}</h3>
              <p className="text-sm">
                {e.organization}
                {e.location && <span> · {e.location}</span>}
              </p>
              <p className="mt-2 text-sm leading-relaxed">{e.description}</p>
              {e.project && (
                <Link href={`/projects/${e.project}`} className="mt-3 inline-flex font-mono text-sm underline underline-offset-4 hover:no-underline">
                  View project →
                </Link>
              )}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
