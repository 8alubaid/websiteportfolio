import type { Metadata } from "next";
import Link from "next/link";
import { ogImage, profile } from "@/data";
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
              <Link href="/#case-study" className="underline-offset-4 hover:underline">
                Case study
              </Link>
            </li>
          </ol>
        </nav>

        <header className="mt-20 border-b border-fg pb-14 lg:mt-28">
          <p className="pixel-label">Case study</p>
          <h1 className="mt-6 max-w-5xl font-display text-[clamp(2.8rem,8vw,6.5rem)] font-semibold leading-[0.92] tracking-[-0.045em]">
            <PixelReveal cell={18}>Strong vs weak prompts</PixelReveal>
          </h1>
          <p className="mt-8 max-w-3xl animate-pixel-wipe text-xl leading-relaxed">
            I built two portfolio sites with Claude. One came from short, open-ended prompts, the other from detailed briefs. Same person, same kind of
            project, very different instructions. Here are the actual prompts, quoted word for word, and what each one led to.
          </p>
          <Link href="/compare/" className="mt-8 inline-block font-mono text-sm underline underline-offset-4 hover:no-underline">
            Compare the two designs side by side →
          </Link>
        </header>

        <div className="mt-20">
          <CaseStudy />
        </div>

        <nav aria-label="More" className="mt-28 flex flex-wrap gap-x-8 gap-y-3 border-t border-fg pt-8 font-mono text-sm">
          <Link href="/" className="inverse px-4 py-2.5 hover:bg-surface hover:text-fg">
            ← Back to portfolio
          </Link>
          <Link href="/compare/" className="self-center underline underline-offset-4 hover:no-underline">
            See the designs side by side →
          </Link>
          <Link href="/terminal?run=case-study" className="self-center underline underline-offset-4 hover:no-underline">
            View in terminal →
          </Link>
        </nav>
      </div>
    </article>
  );
}
