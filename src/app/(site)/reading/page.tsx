import type { Metadata } from "next";
import { ogImage, reading } from "@/data";
import { EmptyState, EntryHead, PageHeader } from "@/components/site/Page";

const description = "Books, articles, papers, and engineering resources worth recommending.";

export const metadata: Metadata = {
  title: "Reading",
  description,
  alternates: { canonical: "/reading/" },
  openGraph: { title: "Reading", description, url: "/reading/", images: [ogImage] },
};

export default function ReadingPage() {
  return (
    <>
      <PageHeader title="Reading" description={description} />
      {reading.length === 0 ? (
        <EmptyState>The list is empty for now. Recommendations will be added here as I go.</EmptyState>
      ) : (
        <ul className="mt-12 grid gap-8">
          {reading.map((r) => (
            <li key={`${r.title}-${r.source}`}>
              <EntryHead
                title={
                  <>
                    {r.href ? (
                      <a href={r.href} target="_blank" rel="noopener noreferrer" className="text-link">
                        {r.title}
                      </a>
                    ) : (
                      r.title
                    )}
                    <span className="text-muted"> · {r.source}</span>
                  </>
                }
                meta={[r.status === "reading" ? "Reading" : r.status === "finished" ? "Finished" : null, r.date].filter(Boolean).join(" · ")}
              />
              {r.note && <p className="mt-2 text-muted">{r.note}</p>}
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
