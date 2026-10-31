import type { Metadata } from "next";
import Link from "next/link";
import { ogImage, projects } from "@/data";
import { EntryHead, PageHeader } from "@/components/site/Page";

const description = "Things I've built and operated, across cloud, AI, software, and embedded hardware.";

export const metadata: Metadata = {
  title: "Projects",
  description,
  alternates: { canonical: "/projects/" },
  openGraph: { title: "Projects", description, url: "/projects/", images: [ogImage] },
};

export default function ProjectsPage() {
  return (
    <>
      <PageHeader title="Projects" description={description} />
      <ol className="mt-12">
        {projects.map((p) => (
          <li key={p.slug} className="border-t border-rule py-9 first:border-t-0 first:pt-0">
            <EntryHead
              title={
                <Link
                  href={`/projects/${p.slug}/`}
                  className="underline decoration-transparent decoration-1 underline-offset-[0.3em] transition-colors duration-200 hover:decoration-current"
                >
                  {p.name}
                </Link>
              }
              meta={p.period}
            />
            <p className="mt-1 text-meta text-muted">
              {p.discipline} · {p.role}
            </p>
            <p className="mt-4">{p.summary}</p>
            <p className="mt-4 text-meta text-muted">{p.stack.join(" · ")}</p>
            <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-1 text-meta">
              <li>
                <Link href={`/projects/${p.slug}/`} className="text-link">
                  read more →
                </Link>
              </li>
              {p.links?.map((l) => (
                <li key={l.href}>
                  <a href={l.href} target="_blank" rel="noopener noreferrer" className="text-link">
                    {l.label} ↗
                  </a>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </>
  );
}
