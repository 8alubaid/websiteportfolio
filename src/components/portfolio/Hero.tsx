import Link from "next/link";
import { profile, projects, resumeUrl, sectors } from "@/data";
import { sections } from "@/data/site";
import { PixelMark } from "@/components/pixel/PixelMark";

/**
 * Opening screen: name, short pitch, the signature pixel mark, and the section
 * index, which is how visitors move around (there is no navbar).
 */
export function Hero() {

  return (
    <section id="top" aria-labelledby="hero-title" className="px-5 sm:px-10 lg:px-16">
      <div className="mx-auto grid min-h-[100svh] max-w-[90rem] grid-rows-[auto_1fr_auto] gap-12 pb-10 pt-6">
        <p className="eyebrow pt-12 sm:pr-56 sm:pt-0">
          {profile.headline} <span aria-hidden="true">/</span> University of Colorado Boulder
        </p>

        <div className="grid items-end gap-14 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <h1 id="hero-title" className="font-display text-[clamp(3.6rem,12vw,10rem)] font-semibold leading-[0.86] tracking-[-0.05em]">
              {profile.name.split(" ").map((part, i) => (
                <span key={part} className={i > 0 ? "block pl-[0.55em]" : "block"}>
                  {part}
                </span>
              ))}
            </h1>
            <p className="mt-10 max-w-xl text-lg leading-relaxed">{profile.tagline}</p>

            <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4 font-mono text-sm">
              <Link href="#projects" className="inverse px-4 py-2.5 transition-colors hover:bg-surface hover:text-fg">
                View projects ↓
              </Link>
              <Link href="/terminal" className="underline decoration-surface decoration-2 underline-offset-[6px] hover:decoration-fg">
                Open terminal →
              </Link>
              {resumeUrl && (
                <a href={resumeUrl} download className="underline decoration-surface decoration-2 underline-offset-[6px] hover:decoration-fg">
                  Résumé (PDF)
                </a>
              )}
            </div>
          </div>

          <div className="lg:col-span-4">
            <PixelMark className="mb-10 w-28 lg:w-40" />
            <nav aria-label="Page index">
              <p className="pixel-label border-b border-surface pb-3">Index</p>
              <ol>
                {sections.map((s, i) => (
                  <li key={s.id}>
                    <Link href={`#${s.id}`} className="group flex items-baseline border-b border-surface py-3.5">
                      <span className="w-10 font-mono text-xs">{String(i + 1).padStart(2, "0")}</span>
                      <span className="pixel-indicator self-center" aria-hidden="true" />
                      <span className="flex-1 text-lg transition-transform duration-150 group-hover:translate-x-1">{s.label}</span>
                      {s.id === "projects" && <span className="font-mono text-xs">{String(projects.length).padStart(2, "0")}</span>}
                    </Link>
                  </li>
                ))}
              </ol>
            </nav>
          </div>
        </div>

        <div className="flex flex-wrap items-end justify-between gap-4 font-mono text-xs uppercase tracking-[0.14em]">
          <p>
            {sectors.map((s, i) => (
              <span key={s.id}>
                {i > 0 && <span aria-hidden="true"> / </span>}
                <Link href={`/?sector=${s.id}#projects`} className="underline-offset-4 hover:underline">
                  {s.label}
                </Link>
              </span>
            ))}
          </p>
          {profile.location && <p>{profile.location}</p>}
        </div>
      </div>
    </section>
  );
}
