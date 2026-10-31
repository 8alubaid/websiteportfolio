import type { Metadata } from "next";
import { certifications, education, ogImage, timeline } from "@/data";
import { EntryHead, PageHeader, PageSection } from "@/components/site/Page";

const description = "Certifications, professional training, and education. Only completed credentials are shown as earned.";

export const metadata: Metadata = {
  title: "Certifications",
  description,
  alternates: { canonical: "/certifications/" },
  openGraph: { title: "Certifications", description, url: "/certifications/", images: [ogImage] },
};

const training = timeline.filter((t) => t.kind === "training");

export default function CertificationsPage() {
  return (
    <>
      <PageHeader title="Certifications" description={description} />

      <ul className="mt-12 grid gap-8">
        {certifications.map((c) => (
          <li key={c.id}>
            <EntryHead title={c.name} meta={c.status === "earned" ? "Earned" : "In progress"} />
            <p className="mt-1 text-meta text-muted">
              {c.issuer}
              {c.verifyUrl && (
                <>
                  {" · "}
                  <a href={c.verifyUrl} target="_blank" rel="noopener noreferrer" className="text-link">
                    verify ↗
                  </a>
                </>
              )}
            </p>
          </li>
        ))}
      </ul>

      <PageSection id="training" title="Training">
        <ul className="mt-8 grid gap-8">
          {training.map((t) => (
            <li key={t.id}>
              <EntryHead title={t.title} meta={t.period} />
              <p className="mt-1 text-meta text-muted">{t.organization}</p>
              <p className="mt-3">{t.description}</p>
            </li>
          ))}
        </ul>
      </PageSection>

      <PageSection id="education" title="Education">
        <ul className="mt-8 grid gap-8">
          {education.map((e) => (
            <li key={e.id}>
              <EntryHead title={e.credential} meta={e.period} />
              <p className="mt-1 text-meta text-muted">{[e.institution, e.location].filter(Boolean).join(" · ")}</p>
              {e.detail && <p className="mt-3">{e.detail}</p>}
            </li>
          ))}
        </ul>
      </PageSection>
    </>
  );
}
