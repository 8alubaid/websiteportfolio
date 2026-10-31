import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProject, ogImage, projects, sectorById } from "@/data";
import { FocusProject } from "@/components/portfolio/FocusProject";

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

/** One titled part of the write-up. */
function Part({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-12">
      <h2 className="text-meta uppercase tracking-[0.12em] text-muted">{title}</h2>
      <div className="mt-3">{children}</div>
    </section>
  );
}

/** Numbered row: a muted index in the margin, content beside it. */
function Numbered({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <li className="grid grid-cols-[2.25rem_1fr]">
      <span className="text-meta leading-[inherit] text-muted">{String(n).padStart(2, "0")}</span>
      <span>{children}</span>
    </li>
  );
}

export default async function ProjectPage({ params }: PageProps<"/projects/[slug]">) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const index = projects.indexOf(project);
  const prev = projects[(index - 1 + projects.length) % projects.length];
  const next = projects[(index + 1) % projects.length];
  const terminalHref = `/terminal?run=${encodeURIComponent(`projects ${project.slug}`)}`;
  const { recruiter, engineering: e } = project;

  const meta: { label: string; value: string }[] = [
    { label: "Role", value: project.role },
    ...(project.context ? [{ label: "Context", value: project.context }] : []),
    ...(project.period ? [{ label: "Period", value: project.period }] : []),
    { label: "Areas", value: project.sectors.map((s) => sectorById[s].label).join(" / ") },
  ];

  return (
    <article>
      <FocusProject slug={project.slug} />
      <Link href="/projects/" className="text-meta text-muted transition-colors duration-200 hover:text-fg">
        ← projects
      </Link>

      <header className="mt-8">
        <h1 className="font-display text-heading font-light tracking-[-0.01em]">{project.name}</h1>
        <p className="mt-2 text-meta text-muted">{project.discipline}</p>
        <p className="mt-6">{project.summary}</p>
        <dl className="mt-8 grid gap-1.5 text-meta">
          {meta.map((m) => (
            <div key={m.label} className="grid grid-cols-[6rem_1fr] gap-4">
              <dt className="text-muted">{m.label}</dt>
              <dd>{m.value}</dd>
            </div>
          ))}
        </dl>
      </header>

      <Part title="Overview">
        <p>{recruiter.overview}</p>
      </Part>
      <Part title="What I did">
        <p>{recruiter.contribution}</p>
      </Part>
      {recruiter.whyItMatters && (
        <Part title="Why it matters">
          <p>{recruiter.whyItMatters}</p>
        </Part>
      )}
      {e.problem && (
        <Part title="Problem">
          <p>{e.problem}</p>
        </Part>
      )}
      {e.architecture && (
        <Part title="Architecture">
          <p>{e.architecture}</p>
        </Part>
      )}
      {e.pipeline?.length ? (
        <Part title="System flow">
          <ol className="grid gap-3">
            {e.pipeline.map((step, i) => (
              <Numbered key={step.label} n={i + 1}>
                {step.label}
                {step.detail && <span className="block text-meta text-muted">{step.detail}</span>}
              </Numbered>
            ))}
          </ol>
        </Part>
      ) : null}
      {e.decisions?.length ? (
        <Part title="Technical decisions">
          <ol className="grid gap-6">
            {e.decisions.map((d, i) => (
              <Numbered key={d.title} n={i + 1}>
                {d.title}
                <span className="mt-1 block text-muted">{d.detail}</span>
              </Numbered>
            ))}
          </ol>
        </Part>
      ) : null}
      {e.challenges?.length ? (
        <Part title="Challenges">
          <ul className="grid gap-3">
            {e.challenges.map((c) => (
              <li key={c} className="grid grid-cols-[2.25rem_1fr]">
                <span aria-hidden="true" className="text-muted">
                  -
                </span>
                {c}
              </li>
            ))}
          </ul>
        </Part>
      ) : null}
      {project.results?.length ? (
        <Part title="Verified results">
          <dl className="grid gap-4 sm:grid-cols-2">
            {project.results.map((r) => (
              <div key={r.label}>
                <dt className="text-meta text-muted">{r.label}</dt>
                <dd className="font-display text-2xl font-light">{r.value}</dd>
                {r.note && <dd className="text-meta text-muted">{r.note}</dd>}
              </div>
            ))}
          </dl>
        </Part>
      ) : null}
      <Part title="Technologies">
        <p>{project.stack.join(" · ")}</p>
      </Part>
      <Part title="Links">
        <ul className="grid gap-1">
          {project.links?.map((l) => (
            <li key={l.href}>
              <a href={l.href} target="_blank" rel="noopener noreferrer" className="text-link">
                {l.label} ↗
              </a>
            </li>
          ))}
          <li>
            <Link href={terminalHref} className="text-link">
              View in the terminal →
            </Link>
          </li>
        </ul>
      </Part>
      {project.notes?.length ? (
        <Part title="Scope & attribution">
          <ul className="grid gap-3 text-muted">
            {project.notes.map((n) => (
              <li key={n}>{n}</li>
            ))}
          </ul>
        </Part>
      ) : null}

      <nav aria-label="More projects" className="mt-20 flex justify-between gap-6 border-t border-rule pt-6 text-meta">
        <Link href={`/projects/${prev.slug}/`} className="text-muted transition-colors duration-200 hover:text-fg">
          ← {prev.name}
        </Link>
        <Link href={`/projects/${next.slug}/`} className="text-right text-muted transition-colors duration-200 hover:text-fg">
          {next.name} →
        </Link>
      </nav>
    </article>
  );
}
