import Link from "next/link";
import { caveats, counterexample, criteria, pairs, sites, stats, takeaways, type PromptPair } from "@/data/case-study";
import { PixelReveal } from "@/components/pixel/PixelReveal";
import { cn } from "@/lib/cn";

/** Filled square = meets the criterion, outlined = doesn't. Text alternative for screen readers. */
function Mark({ on }: { on: boolean }) {
  return (
    <>
      <span aria-hidden="true" className={cn("inline-block size-3", on ? "bg-fg" : "border border-fg")} />
      <span className="sr-only">{on ? "yes" : "no"}</span>
    </>
  );
}

function Quote({ children }: { children: string }) {
  return <blockquote className="whitespace-pre-wrap border-l-2 border-fg pl-4 font-mono text-sm leading-relaxed">{children}</blockquote>;
}

/** Stats table, shared by the home teaser and the full page. */
export function CaseStudyStats() {
  return (
    <table className="w-full border-collapse text-left">
      <caption className="sr-only">Measured from both session transcripts</caption>
      <thead>
        <tr className="border-b border-fg font-mono text-xs uppercase tracking-[0.12em]">
          <th scope="col" className="py-3 pr-4 font-normal">
            Measure
          </th>
          <th scope="col" className="py-3 pr-4 font-normal">
            {sites[0].label}
          </th>
          <th scope="col" className="py-3 font-normal">
            {sites[1].label}
          </th>
        </tr>
      </thead>
      <tbody>
        {stats.map((s) => (
          <tr key={s.label} className="border-b border-surface align-top">
            <th scope="row" className="py-4 pr-4 font-normal">
              {s.label}
              {s.note && <span className="mt-1 block font-mono text-xs leading-snug">{s.note}</span>}
            </th>
            <td className="py-4 pr-4 font-display text-2xl font-semibold">{s.weak}</td>
            <td className="py-4 font-display text-2xl font-semibold">{s.strong}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/** Home-page section: the headline numbers and a link to the full write-up. */
export function CaseStudyTeaser() {
  return (
    <div className="grid gap-14 lg:grid-cols-12">
      <div className="lg:col-span-5">
        <p className="text-lg leading-relaxed">
          I built two portfolio sites with Claude: <a href={sites[0].url} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:no-underline">{sites[0].name}</a> from
          short, open-ended prompts, and this one from detailed briefs. The case study puts the actual prompts side by side and shows what each one led to.
        </p>
        <Link href="/case-study/" className="inverse mt-8 inline-block px-4 py-2.5 font-mono text-sm transition-colors hover:bg-surface hover:text-on-surface">
          Read the case study →
        </Link>
        <Link href="/compare/" className="ml-6 mt-8 inline-block font-mono text-sm underline underline-offset-4 hover:no-underline">
          Compare the designs →
        </Link>
      </div>
      <div className="lg:col-span-7">
        <CaseStudyStats />
      </div>
    </div>
  );
}

function Pair({ pair, index }: { pair: PromptPair; index: number }) {
  return (
    <article aria-labelledby={`${pair.id}-title`} className="border-t border-fg pt-8">
      <header className="grid gap-2 lg:grid-cols-12">
        <p className="pixel-label lg:col-span-4">Round {String(index + 1).padStart(2, "0")}</p>
        <div className="lg:col-span-8">
          <h3 id={`${pair.id}-title`} className="text-3xl font-semibold tracking-tight">
            {pair.title}
          </h3>
          <p className="mt-2">{pair.task}</p>
        </div>
      </header>

      <div className="mt-10 grid gap-12 lg:grid-cols-2">
        <section aria-label={sites[0].label}>
          <p className="eyebrow">
            {sites[0].label} · {pair.weak.date}
          </p>
          <div className="mt-4">
            <Quote>{pair.weak.quote}</Quote>
          </div>
          <p className="eyebrow mt-6">What happened</p>
          <p className="mt-2 leading-relaxed">{pair.weak.outcome}</p>
        </section>

        <section aria-label={sites[1].label}>
          <p className="eyebrow">
            {sites[1].label} · {pair.strong.date} · excerpts
          </p>
          <div className="mt-4 grid gap-3">
            {pair.strong.excerpts.map((e) => (
              <Quote key={e}>{e}</Quote>
            ))}
          </div>
          <p className="eyebrow mt-6">What happened</p>
          <p className="mt-2 leading-relaxed">{pair.strong.outcome}</p>
        </section>
      </div>

      <table className="mt-10 w-full max-w-xl border-collapse text-left text-sm">
        <caption className="eyebrow mb-3 text-left">Against the six criteria</caption>
        <thead>
          <tr className="border-b border-surface font-mono text-xs">
            <th scope="col" className="py-2 font-normal">
              Criterion
            </th>
            <th scope="col" className="w-24 py-2 font-normal">
              Weaker
            </th>
            <th scope="col" className="w-24 py-2 font-normal">
              Stronger
            </th>
          </tr>
        </thead>
        <tbody>
          {criteria.map((c) => (
            <tr key={c.id} className="border-b border-surface">
              <th scope="row" className="py-2 font-normal">
                {c.label}
              </th>
              <td className="py-2">
                <Mark on={pair.scores[c.id][0]} />
              </td>
              <td className="py-2">
                <Mark on={pair.scores[c.id][1]} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </article>
  );
}

/** The full case study page body. */
export function CaseStudy() {
  return (
    <div className="grid gap-24">
      <section aria-labelledby="sites-title" className="grid gap-10 lg:grid-cols-2">
        <h2 id="sites-title" className="sr-only">
          The two sites
        </h2>
        {sites.map((s) => (
          <div key={s.name} className="border-t border-fg pt-6">
            <p className="pixel-label">{s.label}</p>
            <p className="mt-4 font-display text-3xl font-semibold tracking-tight">
              {s.url.startsWith("http") ? (
                <a href={s.url} target="_blank" rel="noopener noreferrer" className="underline decoration-2 underline-offset-[6px] hover:no-underline">
                  {s.name} ↗
                </a>
              ) : (
                s.name
              )}
            </p>
            <dl className="mt-6 grid grid-cols-[7rem_1fr] gap-y-2 text-sm">
              <dt className="eyebrow pt-0.5">Session</dt>
              <dd>{s.session}</dd>
              <dt className="eyebrow pt-0.5">Period</dt>
              <dd>{s.period}</dd>
            </dl>
          </div>
        ))}
      </section>

      <section aria-labelledby="numbers-title">
        <h2 id="numbers-title" className="text-3xl font-semibold tracking-tight">
          <PixelReveal>The numbers</PixelReveal>
        </h2>
        <p className="mt-3 max-w-2xl">Counted from both session transcripts with the same script, as of 26 Oct 2026.</p>
        <div className="mt-8">
          <CaseStudyStats />
        </div>
      </section>

      <section aria-labelledby="criteria-title">
        <h2 id="criteria-title" className="text-3xl font-semibold tracking-tight">
          <PixelReveal>Six things a strong prompt does</PixelReveal>
        </h2>
        <ol className="mt-8 grid gap-x-12 sm:grid-cols-2">
          {criteria.map((c, i) => (
            <li key={c.id} className="grid grid-cols-[2.5rem_1fr] border-t border-surface py-4">
              <span className="font-mono text-xs">{String(i + 1).padStart(2, "0")}</span>
              <span>
                <span className="block font-semibold">{c.label}</span>
                <span className="mt-1 block text-sm">{c.question}</span>
              </span>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="rounds-title" className="grid gap-20">
        <h2 id="rounds-title" className="text-3xl font-semibold tracking-tight">
          <PixelReveal>Side by side</PixelReveal>
        </h2>
        {pairs.map((p, i) => (
          <Pair key={p.id} pair={p} index={i} />
        ))}
      </section>

      <section aria-labelledby="counter-title" className="border-t border-fg pt-8">
        <h2 id="counter-title" className="text-3xl font-semibold tracking-tight">
          A short prompt that worked
        </h2>
        <div className="mt-8 grid gap-10 lg:grid-cols-2">
          <div>
            <p className="eyebrow">
              {sites[0].label} · {counterexample.date}
            </p>
            <div className="mt-4">
              <Quote>{counterexample.quote}</Quote>
            </div>
          </div>
          <p className="self-end text-lg leading-relaxed">{counterexample.lesson}</p>
        </div>
      </section>

      <section aria-labelledby="takeaways-title">
        <h2 id="takeaways-title" className="text-3xl font-semibold tracking-tight">
          <PixelReveal>What I took away</PixelReveal>
        </h2>
        <ol className="mt-8 grid gap-x-12 lg:grid-cols-2">
          {takeaways.map((t, i) => (
            <li key={t.title} className="grid grid-cols-[2.5rem_1fr] border-t border-surface py-6">
              <span className="font-mono text-xs">{String(i + 1).padStart(2, "0")}</span>
              <span>
                <span className="block text-xl font-semibold">{t.title}</span>
                <span className="mt-2 block leading-relaxed">{t.body}</span>
              </span>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="caveats-title" className="border-t border-surface pt-6">
        <h2 id="caveats-title" className="eyebrow">
          Limits of this comparison
        </h2>
        <p className="mt-3 max-w-3xl leading-relaxed">{caveats}</p>
      </section>
    </div>
  );
}
