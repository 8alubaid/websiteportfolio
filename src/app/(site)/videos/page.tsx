import type { Metadata } from "next";
import Image from "next/image";
import { ogImage, videos } from "@/data";
import { withBasePath } from "@/lib/base-path";
import { EmptyState, EntryHead, PageHeader } from "@/components/site/Page";

const description = "Project demos, walkthroughs, and technical explanations.";

export const metadata: Metadata = {
  title: "Videos",
  description,
  alternates: { canonical: "/videos/" },
  openGraph: { title: "Videos", description, url: "/videos/", images: [ogImage] },
};

export default function VideosPage() {
  return (
    <>
      <PageHeader title="Videos" description={description} />
      {videos.length === 0 ? (
        <EmptyState>No videos yet. Demos and project walkthroughs will be posted here.</EmptyState>
      ) : (
        <ul className="mt-12 grid gap-12">
          {videos.map((v) => (
            <li key={v.href}>
              <a href={v.href} target="_blank" rel="noopener noreferrer" className="group block">
                {v.thumbnail && (
                  <Image
                    src={withBasePath(v.thumbnail)}
                    alt=""
                    width={1280}
                    height={720}
                    className="mb-4 aspect-video w-full border border-rule object-cover"
                  />
                )}
                <EntryHead
                  title={
                    <span className="underline decoration-transparent decoration-1 underline-offset-[0.3em] transition-colors duration-200 group-hover:decoration-current">
                      {v.title} ↗
                    </span>
                  }
                  meta={v.date}
                />
                <p className="mt-3 text-muted">{v.description}</p>
              </a>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
