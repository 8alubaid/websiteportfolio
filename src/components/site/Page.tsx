import type { ReactNode } from "react";

/** A section page's title and one-line description. */
export function PageHeader({ title, description }: { title: string; description?: ReactNode }) {
  return (
    <header>
      <h1 className="font-display text-heading font-light tracking-[-0.01em]">{title}</h1>
      {description && <p className="mt-3 text-muted">{description}</p>}
    </header>
  );
}

/** A titled group inside a page. */
export function PageSection({ id, title, children, className }: { id?: string; title: string; children: ReactNode; className?: string }) {
  const headingId = id ? `${id}-title` : undefined;
  return (
    <section id={id} aria-labelledby={headingId} className={className ?? "mt-16"}>
      <h2 id={headingId} className="font-display text-xl font-light tracking-[-0.01em]">
        {title}
      </h2>
      {children}
    </section>
  );
}

/** Shown when a section has nothing published yet. Says so plainly; never placeholder entries. */
export function EmptyState({ children }: { children: ReactNode }) {
  return (
    <div className="mt-12 border-l border-rule pl-5 text-muted">
      <p>{children}</p>
    </div>
  );
}

/** "Title — meta" row used by every list: the title can wrap, the meta stays right-aligned on wide screens. */
export function EntryHead({ title, meta }: { title: ReactNode; meta?: ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
      <h3 className="min-w-0">{title}</h3>
      {meta && <p className="shrink-0 text-meta text-muted">{meta}</p>}
    </div>
  );
}
