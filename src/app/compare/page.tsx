import type { Metadata } from "next";
import Link from "next/link";
import { ogImage, profile } from "@/data";
import { designComparison, sites } from "@/data/case-study";
import { PixelReveal } from "@/components/pixel/PixelReveal";
import { SplitCompare } from "@/components/portfolio/SplitCompare";
import "@/styles/legacy-farisbalubaid.css";
import oldDesktop from "@/assets/compare/old-desktop.webp";
import newDesktop from "@/assets/compare/new-desktop.webp";
import oldMobile from "@/assets/compare/old-mobile.webp";
import newMobile from "@/assets/compare/new-mobile.webp";

const description =
  "The two portfolio homepages cut in half: the site built from short, scattered prompts on the left, the one built from a single detailed brief on the right.";

export const metadata: Metadata = {
  title: "Design comparison: weak vs strong prompts",
  description,
  alternates: { canonical: "/compare/" },
  openGraph: { title: "Design comparison: weak vs strong prompts", description, url: "/compare/", images: [ogImage] },
};

// Small, fixed tilts and offsets make the weak-prompt pile look as scattered as the prompts were.
const tilt = ["-rotate-2", "rotate-1", "-rotate-1", "rotate-2", "-rotate-[1.5deg]", "rotate-[0.5deg]", "-rotate-1"];
const nudge = ["ml-0", "ml-6", "ml-2", "ml-10", "ml-4", "ml-8", "ml-1"];

export default function ComparePage() {
  const { weakTrail, weakSummary, strongBrief, captured, note } = designComparison;
  const [weak, strong] = sites;

  return (
    <article className="px-5 pb-16 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-[90rem]">
        <nav aria-label="Breadcrumb" className="pr-44 pt-6 font-mono text-xs">
          <ol className="flex flex-wrap items-center gap-3">
            <li>
              <Link href="/" className="underline-offset-4 hover:underline">
                {profile.name}
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link href="/case-study/" className="underline-offset-4 hover:underline">
                Case study
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page">Design</li>
          </ol>
        </nav>

        <header className="mt-20 lg:mt-28">
          <p className="pixel-label">Design comparison</p>
          <h1 className="mt-6 max-w-5xl font-display text-[clamp(2.8rem,8vw,6.5rem)] font-semibold leading-[0.92] tracking-[-0.045em]">
            <PixelReveal cell={18}>Same person. Two prompts.</PixelReveal>
          </h1>
          <p className="mt-8 max-w-3xl text-xl leading-relaxed">
            Both homepages, cut in half. On the left, {weak.name}, shaped by short prompts sent over six weeks. On the right, this site, shaped by one
            detailed brief. Drag the divider to compare.
          </p>
        </header>

        <section aria-label="Homepages side by side" className="mt-16">
          <SplitCompare
            beforeLabel={`Weaker · ${weak.name}`}
            afterLabel="Stronger · this site"
            shortLabels={["Weaker", "Stronger"]}
            views={[
              {
                id: "desktop",
                label: "Desktop",
                before: { src: oldDesktop, alt: `${weak.name} homepage at desktop size: a gold 3D globe behind the name, a voxel avatar, and four buttons.` },
                after: { src: newDesktop, alt: "This site's homepage at desktop size: large type, the FB pixel mark, and a numbered section index, in three colors." },
              },
              {
                id: "phone",
                label: "Phone",
                before: { src: oldMobile, alt: `${weak.name} homepage on a phone.` },
                after: { src: newMobile, alt: "This site's homepage on a phone." },
              },
            ]}
          />
        </section>

        <div className="mt-24 grid gap-16 lg:grid-cols-2 lg:gap-0">
          {/* Left: the weak prompts, scattered as they were, dressed in the old site's own design system. */}
          <section aria-labelledby="weak-title" className="legacy-site p-6 sm:p-10 lg:mr-12">
            <p className="legacy-label">{weak.label}</p>
            <h2 id="weak-title" className="legacy-h2">
              {weakSummary}
            </h2>
            <p className="legacy-muted mt-4">
              The prompts behind the left half, in the order they were sent, styled like {weak.name} itself. Each one changed direction a little.
            </p>
            <ol className="mt-10 pb-4">
              {weakTrail.map((p, i) => (
                <li
                  key={p.text}
                  className={`legacy-card relative max-w-md ${tilt[i % tilt.length]} ${nudge[i % nudge.length]} ${i > 0 ? "-mt-5" : ""}`}
                  // Inline so it beats the legacy stylesheet's padding: the overlap only ever covers empty space.
                  style={{ zIndex: i + 1, paddingBottom: "3.25rem" }}
                >
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="legacy-tag">Prompt {String(i + 1).padStart(2, "0")}</span>
                    <span className="legacy-date">{p.date}</span>
                  </div>
                  <p className="mt-3 text-[0.95rem] leading-relaxed">“{p.text}”</p>
                </li>
              ))}
            </ol>
          </section>

          {/* Right: the strong brief, as structured as it was. */}
          <section aria-labelledby="strong-title" className="lg:pl-12">
            <p className="pixel-label">{strong.label}</p>
            <h2 id="strong-title" className="mt-4 text-3xl font-semibold tracking-tight">
              {strongBrief.summary}
            </h2>
            <p className="mt-3">The brief behind the right half, sent on {strongBrief.date}. Its section outline, word for word:</p>
            <div className="mt-10 border border-fg">
              <p className="inverse px-4 py-2 font-mono text-xs">{strongBrief.title}</p>
              <ol className="divide-y divide-surface font-mono text-sm">
                {strongBrief.outline.map((h, i) => (
                  <li key={h} className="grid grid-cols-[2.5rem_1fr] px-4 py-2.5">
                    <span>{String(i + 1).padStart(2, "0")}</span>
                    <span>{h}</span>
                  </li>
                ))}
              </ol>
            </div>
            <p className="eyebrow mt-10">Four lines from it</p>
            <ul className="mt-4 grid gap-3">
              {strongBrief.highlights.map((h) => (
                <li key={h} className="border-l-2 border-fg pl-4 font-mono text-sm leading-relaxed">
                  {h}
                </li>
              ))}
            </ul>
          </section>
        </div>

        <p className="mt-20 max-w-3xl border-t border-surface pt-6 text-sm leading-relaxed">
          Screenshots captured {captured} with headless Chrome at 1440×900 (desktop) and 390×844 (phone), from{" "}
          <a href={weak.url} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:no-underline">
            {weak.name}
          </a>{" "}
          and this site. {note}
        </p>

        <nav aria-label="More" className="mt-16 flex flex-wrap gap-x-8 gap-y-3 border-t border-fg pt-8 font-mono text-sm">
          <Link href="/case-study/" className="inverse px-4 py-2.5 hover:bg-surface hover:text-fg">
            ← Read the full case study
          </Link>
          <Link href="/" className="self-center underline underline-offset-4 hover:no-underline">
            Back to portfolio
          </Link>
        </nav>
      </div>
    </article>
  );
}
