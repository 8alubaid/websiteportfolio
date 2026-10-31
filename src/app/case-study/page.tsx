import type { Metadata } from "next";
import Link from "next/link";
import { pageContainer } from "@/lib/layout";
import { ogImage } from "@/data";
import { CaseStudy } from "@/components/portfolio/CaseStudy";
import { PixelReveal } from "@/components/pixel/PixelReveal";

const description =
  "Two portfolio sites built with Claude by the same person: one from short prompts, one from detailed briefs. The real prompts side by side, with what each led to.";

export const metadata: Metadata = {
  title: "Case study: strong vs weak prompts",
  description,
  alternates: { canonical: "/case-study/" },
  openGraph: { title: "Case study: strong vs weak prompts", description, url: "/case-study/", images: [ogImage] },
};

export default function CaseStudyPage() {
  return (
    <article className="pb-28 pt-12 md:pt-16">
      <div className={pageContainer}>
        <Link href="/writing/" className="text-meta text-muted transition-colors duration-200 hover:text-fg">
          ← writing
        </Link>

        <header className="mt-10 border-b border-rule pb-12">
          <p className="pixel-label">Case study</p>
          <h1 className="mt-6 max-w-5xl font-display text-[clamp(2rem,4.5vw,2.75rem)] font-light leading-[1.1] tracking-[-0.02em]">
            <PixelReveal cell={18}>Strong vs weak prompts</PixelReveal>
          </h1>
          <p className="mt-8 max-w-3xl animate-pixel-wipe">
            I built two portfolio sites with Claude. One came from short, open-ended prompts, the other from detailed briefs. Same person, same kind of
            project, very different instructions. Here are the actual prompts, quoted word for word, and what each one led to.
          </p>
          <Link href="/compare/" className="mt-8 inline-block text-link text-meta">
            Compare the two designs side by side →
          </Link>
        </header>

        <div className="mt-20">
          <CaseStudy />
        </div>

        <nav aria-label="More" className="mt-28 flex flex-wrap gap-x-8 gap-y-3 border-t border-rule pt-8 text-meta">
          <Link href="/writing/" className="text-link">
            ← All writing
          </Link>
          <Link href="/compare/" className="text-link">
            See the designs side by side →
          </Link>
          <Link href="/terminal?run=case-study" className="text-link">
            View in terminal →
          </Link>
        </nav>
      </div>
    </article>
  );
}
