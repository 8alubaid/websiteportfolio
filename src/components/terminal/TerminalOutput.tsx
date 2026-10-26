"use client";

import Link from "next/link";
import { memo } from "react";
import type { Action, Block, Span, Tone } from "@/lib/terminal/types";
import { cn } from "@/lib/cn";

/** One color throughout: emphasis is carried by weight only. */
const toneClass: Record<Tone, string> = {
  default: "",
  strong: "font-bold",
  muted: "font-light",
};

type Run = (command: string) => void;

const linkClass = "underline decoration-1 underline-offset-4 hover:inverse hover:no-underline";

function SpanView({ span, run }: { span: Span; run: Run }) {
  if (typeof span === "string") return <>{span}</>;

  if ("command" in span) {
    return (
      <button
        type="button"
        onClick={() => run(span.command)}
        className={cn("cursor-pointer underline decoration-dotted decoration-1 underline-offset-4 hover:inverse hover:no-underline", toneClass[span.tone ?? "strong"])}
        title={`Run: ${span.command}`}
      >
        {span.text}
      </button>
    );
  }

  if ("href" in span) {
    return span.external || !span.href.startsWith("/") ? (
      <a href={span.href} target={span.href.startsWith("mailto:") ? undefined : "_blank"} rel="noopener noreferrer" className={linkClass}>
        {span.text}
      </a>
    ) : (
      <Link href={span.href} className={linkClass}>
        {span.text}
      </Link>
    );
  }

  return <span className={cn(toneClass[span.tone ?? "default"], span.bold && "font-bold")}>{span.text}</span>;
}

function Spans({ spans, run }: { spans: Span[]; run: Run }) {
  return (
    <>
      {spans.map((s, i) => (
        <SpanView key={i} span={s} run={run} />
      ))}
    </>
  );
}

function ActionView({ action, run }: { action: Action; run: Run }) {
  const cls = "inline-flex min-h-8 items-center border border-surface px-2.5 hover:inverse hover:border-fg";
  if (action.command) {
    return (
      <button type="button" className={cls} onClick={() => run(action.command!)}>
        {action.label}
      </button>
    );
  }
  if (action.href && (action.external || !action.href.startsWith("/"))) {
    return (
      <a href={action.href} target="_blank" rel="noopener noreferrer" className={cls}>
        {action.label} ↗
      </a>
    );
  }
  return (
    <Link href={action.href ?? "/"} className={cls}>
      {action.label} →
    </Link>
  );
}

function BlockView({ block, run }: { block: Block; run: Run }) {
  switch (block.type) {
    case "line":
      return (
        <p className="whitespace-pre-wrap break-words">
          <Spans spans={block.spans} run={run} />
        </p>
      );
    case "paragraph":
      return <p className={cn("max-w-[80ch] whitespace-pre-wrap break-words", toneClass[block.tone ?? "default"])}>{block.text}</p>;
    case "heading":
      return (
        <div className="mt-1 flex flex-wrap items-baseline gap-x-3 gap-y-1 border-b border-surface pb-2">
          <p className="inverse px-1.5 font-bold tracking-wide">{block.text}</p>
          {block.meta && <p className="font-light">{block.meta}</p>}
        </div>
      );
    case "section":
      return (
        <p className="mt-2 flex items-center gap-2 font-bold uppercase tracking-[0.14em]">
          <span className="size-1.5 bg-fg" aria-hidden="true" />
          {block.text}
        </p>
      );
    case "blank":
      return <div className="h-2" aria-hidden="true" />;
    case "rows":
      return (
        <dl className="grid gap-x-6 gap-y-1.5 sm:grid-cols-[minmax(9rem,max-content)_1fr]">
          {block.rows.map((row, i) => (
            <div key={i} className="contents">
              <dt className="whitespace-nowrap">
                <Spans spans={row.key} run={run} />
              </dt>
              <dd className="mb-1 break-words pl-3 sm:mb-0 sm:pl-0">
                <Spans spans={row.value} run={run} />
              </dd>
            </div>
          ))}
        </dl>
      );
    case "list":
      return (
        <ul className="grid gap-1">
          {block.items.map((item, i) => (
            <li key={i} className="flex gap-2">
              <span className="shrink-0 font-light" aria-hidden="true">
                {block.bullet ?? "-"}
              </span>
              <span className="min-w-0 whitespace-pre-wrap break-words">
                <Spans spans={item} run={run} />
              </span>
            </li>
          ))}
        </ul>
      );
    case "grid":
      return (
        <ul className="flex flex-wrap gap-x-6 gap-y-1">
          {block.items.map((item, i) => (
            <li key={i}>
              <SpanView span={item} run={run} />
            </li>
          ))}
        </ul>
      );
    case "tags":
      return (
        <p>
          {block.tags.map((t, i) => (
            <span key={t}>
              {i > 0 && <span className="font-light"> / </span>}
              {t}
            </span>
          ))}
        </p>
      );
    case "pipeline":
      return (
        <ol className="flex flex-wrap items-center gap-y-2" aria-label="System flow">
          {block.steps.map((s, i) => (
            <li key={s.label} className="flex items-center">
              <span>
                <span className="font-bold">{s.label}</span>
                {s.detail && <span className="font-light"> ({s.detail})</span>}
              </span>
              {i < block.steps.length - 1 && (
                <span className="px-2 font-light" aria-hidden="true">
                  ──▶
                </span>
              )}
            </li>
          ))}
        </ol>
      );
    case "results":
      return (
        <dl className="grid gap-x-6 gap-y-1 sm:grid-cols-[minmax(9rem,max-content)_1fr]">
          {block.results.map((r) => (
            <div key={r.label} className="contents">
              <dt className="font-light">{r.label}</dt>
              <dd className="mb-1 pl-3 sm:mb-0 sm:pl-0">
                <span className="font-bold">{r.value}</span>
                {r.note && <span className="font-light">  {r.note}</span>}
              </dd>
            </div>
          ))}
        </dl>
      );
    case "actions":
      return (
        <div className="mt-2 flex flex-wrap gap-2">
          {block.actions.map((a) => (
            <ActionView key={a.label} action={a} run={run} />
          ))}
        </div>
      );
    case "error":
      return (
        <p className="whitespace-pre-wrap break-words">
          <span className="inverse mr-2 px-1 font-bold">ERR</span>
          <Spans spans={block.spans} run={run} />
        </p>
      );
  }
}

export const TerminalOutput = memo(function TerminalOutput({ blocks, run }: { blocks: Block[]; run: Run }) {
  return (
    <div className="grid gap-1.5">
      {blocks.map((b, i) => (
        <BlockView key={i} block={b} run={run} />
      ))}
    </div>
  );
});
