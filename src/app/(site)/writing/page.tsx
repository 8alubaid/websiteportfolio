import type { Metadata } from "next";
import Link from "next/link";
import { ogImage, writing } from "@/data";
import { EmptyState, EntryHead, PageHeader } from "@/components/site/Page";

const description = "Notes and write-ups on building things, and on building them with AI.";

export const metadata: Metadata = {
  title: "Writing",
  description,
  alternates: { canonical: "/writing/" },
  openGraph: { title: "Writing", description, url: "/writing/", images: [ogImage] },
};

const titleLink = "underline decoration-transparent decoration-1 underline-offset-[0.3em] transition-colors duration-200 hover:decoration-current";

export default function WritingPage() {
  return (
    <>
      <PageHeader title="Writing" description={description} />
      {writing.length === 0 ? (
        <EmptyState>Nothing published yet.</EmptyState>
      ) : (
        <ul className="mt-12 grid gap-10">
          {writing.map((a) => {
            const external = /^https?:\/\//.test(a.href);
            return (
              <li key={a.href}>
                <EntryHead
                  title={
                    external ? (
                      <a href={a.href} target="_blank" rel="noopener noreferrer" className={titleLink}>
                        {a.title} ↗
                      </a>
                    ) : (
                      <Link href={a.href} className={titleLink}>
                        {a.title}
                      </Link>
                    )
                  }
                  meta={a.date}
                />
                {a.topic && <p className="mt-1 text-meta text-muted">{a.topic}</p>}
                <p className="mt-3 text-muted">{a.description}</p>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
