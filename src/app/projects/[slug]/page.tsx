import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getProject, ogImage, profile, projectNumber, projects, sectorById } from "@/data";
import type { Project } from "@/types/portfolio";
import { BriefTabs } from "@/components/portfolio/BriefTabs";
import { FocusProject } from "@/components/portfolio/FocusProject";
import { PipelineDiagram } from "@/components/portfolio/PipelineDiagram";
import { PixelReveal } from "@/components/pixel/PixelReveal";

// Only the projects in the data exist; anything else is the static 404 page.
export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return { title: "Project not found" };
  return {
    title: project.title,
    description: project.summary,
    alternates: { canonical: `/projects/${project.slug}/` },
    // A page-level openGraph replaces the root one, so the image is repeated here.
    openGraph: { title: project.title, description: project.summary, url: `/projects/${project.slug}/`, images: [ogImage] },
  };
}

/** A labelled row: mono label in the margin, content in the measure. */
function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section className="grid gap-3 border-t border-surface py-8 md:grid-cols-[11rem_1fr] md:gap-10">
      <h3 className="eyebrow pt-1">{label}</h3>
      <div className="max-w-[68ch] text-lg leading-relaxed">{children}</div>
    </section>
  );
}

function RecruiterBrief({ project }: { project: Project }) {
  const { overview, contribution, whyItMatters } = project.recruiter;
  return (
    <div>
      <Row label="What it is">{overview}</Row>
      <Row label="What I did">{contribution}</Row>
      {whyItMatters && <Row label="Why it matters">{whyItMatters}</Row>}
    </div>
  );
}

function EngineeringBrief({ project }: { project: Project }) {
  const e = project.engineering;
  const empty = !e.problem && !e.architecture && !e.pipeline && !e.decisions && !e.challenges;
  return (
    <div>
      {empty && <p>A detailed engineering write-up for this project is coming soon.</p>}
      {e.problem && <Row label="Problem">{e.problem}</Row>}
      {e.architecture && <Row label="Architecture">{e.architecture}</Row>}
      {e.pipeline && (
        <div className="border-t border-surface py-8">
          <PipelineDiagram steps={e.pipeline} label="System flow" />
        </div>
      )}
      {e.decisions?.length ? (
        <Row label="Technical decisions">
          <ol className="grid gap-7">
            {e.decisions.map((d, i) => (
              <li key={d.title} className="grid grid-cols-[2.5rem_1fr]">
                <span className="pt-1 font-mono text-xs">{String(i + 1).padStart(2, "0")}</span>
                <span>
                  <span className="block font-semibold">{d.title}</span>
                  <span className="mt-1 block text-base leading-relaxed">{d.detail}</span>
                </span>
              </li>
            ))}
          </ol>
        </Row>
      ) : null}
      {e.challenges?.length ? (
        <Row label="Challenges">
          <ul className="grid gap-4">
            {e.challenges.map((c) => (
              <li key={c} className="grid grid-cols-[2.5rem_1fr] text-base leading-relaxed">
                <span aria-hidden="true" className="mt-2.5 size-1.5 bg-fg" />
                {c}
              </li>
            ))}
          </ul>
        </Row>
      ) : null}
    </div>
  );
}

function ProjectSkeleton() {
  return (
    <div className="mx-auto max-w-[90rem] px-5 pb-24 pt-24 sm:px-10 lg:px-16" aria-busy="true" aria-label="Loading project">
      <div className="h-3 w-40 bg-surface" />
      <div className="mt-12 h-24 w-2/3 bg-surface" />
      <div className="mt-8 h-5 w-1/2 bg-surface" />
    </div>
  );
}

// Params are read inside <Suspense> so navigations render a shell instantly.
// Every slug is prerendered via generateStaticParams, so the fallback rarely shows.
export default function ProjectPage({ params }: PageProps<"/projects/[slug]">) {
  return (
    <Suspense fallback={<ProjectSkeleton />}>
      <ProjectContent params={params} />
    </Suspense>
  );
}

async function ProjectContent({ params }: Pick<PageProps<"/projects/[slug]">, "params">) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const index = projects.indexOf(project);
  const prev = projects[(index - 1 + projects.length) % projects.length];
  const next = projects[(index + 1) % projects.length];
  const terminalHref = `/terminal?run=${encodeURIComponent(`projects ${project.slug}`)}`;

  const meta: { label: string; value: React.ReactNode }[] = [
    { label: "Role", value: project.role },
    ...(project.context ? [{ label: "Context", value: project.context }] : []),
    ...(project.period ? [{ label: "Period", value: project.period }] : []),
    {
      label: "Areas",
      value: project.sectors.map((s, i) => (
        <span key={s}>
          {i > 0 && " / "}
          <Link href={`/?sector=${s}#projects`} className="underline-offset-4 hover:underline">
            {sectorById[s].label}
          </Link>
        </span>
      )),
    },
  ];

  return (
    <article className="px-5 pb-16 sm:px-10 lg:px-16">
      <FocusProject slug={project.slug} />
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
              <Link href="/#projects" className="underline-offset-4 hover:underline">
                Projects
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page">{projectNumber(project)}</li>
          </ol>
        </nav>

        <header className="mt-20 grid gap-14 border-b border-fg pb-14 lg:mt-28 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <p className="pixel-label">
              Project {projectNumber(project)} / {String(projects.length).padStart(2, "0")}
            </p>
            <h1 className="mt-6 font-display text-[clamp(3rem,9vw,7.5rem)] font-semibold leading-[0.9] tracking-[-0.045em]">
              <PixelReveal cell={18}>{project.name}</PixelReveal>
            </h1>
            <p className="mt-5 font-mono text-xs uppercase tracking-[0.14em]">{project.discipline}</p>
            <p className="mt-8 max-w-2xl animate-pixel-wipe text-xl leading-relaxed">{project.summary}</p>
          </div>

          <dl className="self-end lg:col-span-4">
            {meta.map((m) => (
              <div key={m.label} className="grid grid-cols-[6.5rem_1fr] gap-4 border-t border-surface py-3 text-sm">
                <dt className="eyebrow pt-0.5">{m.label}</dt>
                <dd>{m.value}</dd>
              </div>
            ))}
            <div className="grid grid-cols-[6.5rem_1fr] gap-4 border-y border-surface py-3 text-sm">
              <dt className="eyebrow pt-0.5">Links</dt>
              <dd className="grid gap-1.5">
                {project.links?.map((l) => (
                  <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:no-underline">
                    {l.label} ↗
                  </a>
                ))}
                <Link href={terminalHref} className="underline underline-offset-4 hover:no-underline">
                  View in terminal →
                </Link>
              </dd>
            </div>
          </dl>
        </header>

        <div className="mt-14 grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <BriefTabs
              tabs={[
                { id: "overview", label: "Recruiter overview", hint: "Plain language", content: <RecruiterBrief project={project} /> },
                { id: "engineering", label: "Engineering deep dive", hint: "Architecture & decisions", content: <EngineeringBrief project={project} /> },
              ]}
            />
          </div>

          <aside className="grid content-start gap-12 lg:col-span-4 lg:border-l lg:border-surface lg:pl-10">
            {project.results?.length ? (
              <section>
                <h2 className="eyebrow">Verified results</h2>
                <dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-6">
                  {project.results.map((r) => (
                    <div key={r.label}>
                      <dt className="text-xs">{r.label}</dt>
                      <dd className="mt-1 font-display text-3xl font-semibold tracking-tight">{r.value}</dd>
                      {r.note && <dd className="mt-1 text-xs leading-snug">{r.note}</dd>}
                    </div>
                  ))}
                </dl>
              </section>
            ) : null}

            <section>
              <h2 className="eyebrow">Technologies</h2>
              <ul className="mt-5">
                {project.stack.map((t) => (
                  <li key={t} className="border-b border-surface py-2 first:border-t">
                    {t}
                  </li>
                ))}
              </ul>
            </section>

            {project.notes?.length ? (
              <section>
                <h2 className="eyebrow">Scope &amp; attribution</h2>
                <ul className="mt-5 grid gap-3 text-sm leading-relaxed">
                  {project.notes.map((n) => (
                    <li key={n}>{n}</li>
                  ))}
                </ul>
              </section>
            ) : null}
          </aside>
        </div>

        <nav aria-label="More projects" className="mt-28 grid border-t border-fg sm:grid-cols-2">
          <Link href={`/projects/${prev.slug}`} className="group border-b border-surface py-8 sm:border-b-0 sm:border-r sm:pr-8">
            <span className="font-mono text-xs">← Previous · {projectNumber(prev)}</span>
            <span className="mt-3 flex items-center font-display text-2xl font-semibold tracking-tight sm:text-3xl">
              <span className="pixel-indicator" aria-hidden="true" />
              {prev.name}
            </span>
          </Link>
          <Link href={`/projects/${next.slug}`} className="group py-8 sm:pl-8 sm:text-right">
            <span className="font-mono text-xs">Next · {projectNumber(next)} →</span>
            <span className="mt-3 flex items-center font-display text-2xl font-semibold tracking-tight sm:justify-end sm:text-3xl">
              <span className="pixel-indicator" aria-hidden="true" />
              {next.name}
            </span>
          </Link>
        </nav>
      </div>
    </article>
  );
}
