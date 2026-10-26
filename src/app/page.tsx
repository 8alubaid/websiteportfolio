import { Suspense } from "react";
import { sections, type SectionId } from "@/data/site";
import { Hero } from "@/components/portfolio/Hero";
import { About } from "@/components/portfolio/About";
import { SectionHeading } from "@/components/portfolio/SectionHeading";
import { SectionRail } from "@/components/portfolio/SectionRail";
import { ProjectIndex, ProjectIndexView } from "@/components/portfolio/ProjectIndex";
import { Experience } from "@/components/portfolio/Experience";
import { Skills } from "@/components/portfolio/Skills";
import { Certifications } from "@/components/portfolio/Certifications";
import { Contact } from "@/components/portfolio/Contact";
import { CaseStudyTeaser } from "@/components/portfolio/CaseStudy";

const copy: Partial<Record<SectionId, string>> = {
  projects: "Each project has a plain-language overview and an engineering deep dive.",
  "case-study": "Strong vs weak prompts: what changed when I gave Claude detailed briefs instead of short requests.",
  experience: "Education, training, certifications, and project milestones, each labelled by type. Newest first.",
  skills: "Tools and platforms I've used in real projects, grouped by area. No proficiency scores.",
  certifications: "Degrees and certifications. Only completed credentials are shown as earned.",
};

const bodies: Record<SectionId, React.ReactNode> = {
  about: <About />,
  projects: (
    <Suspense fallback={<ProjectIndexView />}>
      <ProjectIndex />
    </Suspense>
  ),
  "case-study": <CaseStudyTeaser />,
  experience: <Experience />,
  skills: <Skills />,
  certifications: <Certifications />,
  contact: <Contact />,
};

export default function HomePage() {
  return (
    <>
      <SectionRail />
      <Hero />
      {sections.map((s, i) => (
        <section key={s.id} id={s.id} aria-labelledby={`${s.id}-title`} className="px-5 pt-28 sm:px-10 lg:px-16 lg:pt-36">
          <div className="mx-auto max-w-[90rem]">
            <SectionHeading id={s.id} index={String(i + 1).padStart(2, "0")} title={s.label} description={copy[s.id]} />
            {bodies[s.id]}
          </div>
        </section>
      ))}
    </>
  );
}
