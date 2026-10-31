import type { Metadata } from "next";
import Link from "next/link";
import { getProject, logKindLabel, ogImage, skillGroups, timeline } from "@/data";
import { EntryHead, PageHeader, PageSection } from "@/components/site/Page";

const description = "Education, training, certifications, and project milestones, newest first.";

export const metadata: Metadata = {
  title: "Experience",
  description,
  alternates: { canonical: "/experience/" },
  openGraph: { title: "Experience", description, url: "/experience/", images: [ogImage] },
};

export default function ExperiencePage() {
  return (
    <>
      <PageHeader title="Experience" description={description} />

      <ol className="mt-12 grid gap-11">
        {timeline.map((entry) => {
          const project = entry.project ? getProject(entry.project) : undefined;
          return (
            <li key={entry.id}>
              <EntryHead title={entry.title} meta={entry.period} />
              <p className="mt-1 text-meta text-muted">
                {[entry.organization, entry.location, logKindLabel[entry.kind]].filter(Boolean).join(" · ")}
              </p>
              <p className="mt-3">{entry.description}</p>
              {project && (
                <Link href={`/projects/${project.slug}/`} className="text-link mt-2 inline-block text-meta">
                  {project.name} →
                </Link>
              )}
            </li>
          );
        })}
      </ol>

      <PageSection id="skills" title="Skills" className="mt-20">
        <p className="mt-3 text-muted">Tools and platforms I&apos;ve used in real projects, grouped by area. No proficiency scores.</p>
        <dl className="mt-8 grid gap-6">
          {skillGroups.map((g) => (
            <div key={g.id}>
              <dt className="text-meta text-muted">{g.label}</dt>
              <dd className="mt-1">{g.skills.join(" · ")}</dd>
            </div>
          ))}
        </dl>
      </PageSection>
    </>
  );
}
