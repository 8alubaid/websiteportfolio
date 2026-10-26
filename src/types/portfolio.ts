/**
 * Shared portfolio content model.
 *
 * Every piece of content is defined once in `src/data/*` using these types and
 * rendered by two independent renderers: Portfolio mode (React components) and
 * the Terminal (structured output blocks from `src/lib/terminal`).
 */

export type SectorId = "cloud" | "ai" | "software" | "embedded";

export interface Sector {
  id: SectorId;
  /** Plain label used everywhere a visitor needs to find something. */
  label: string;
  description: string;
}

export type LinkKind = "github" | "linkedin" | "email" | "demo" | "upstream" | "docs" | "website";

export interface ExternalLink {
  label: string;
  href: string;
  kind: LinkKind;
}

export interface Profile {
  name: string;
  firstName: string;
  /** Short identifier shown in the terminal prompt, e.g. `faris`. */
  handle: string;
  headline: string;
  /** One-sentence elevator pitch. */
  tagline: string;
  /** Paragraphs for the About section. */
  about: string[];
  location?: string;
  /** Discipline ids in display order. */
  focus: SectorId[];
  /** What Faris is looking for — shown in the contact section. */
  availability: string;
  contact: {
    email: string | null;
    github: string | null;
    linkedin: string | null;
    /** Path under /public, e.g. `/resume/faris-balubaid-resume.pdf`, or null if not published yet. */
    resume: string | null;
  };
}

export interface PipelineStep {
  label: string;
  detail?: string;
}

export interface Decision {
  title: string;
  detail: string;
}

export interface Result {
  label: string;
  value: string;
  note?: string;
}

export type ProjectRole = "Solo project" | "Team project" | "Deployment & operations" | "Training project";

export interface Project {
  slug: string;
  title: string;
  /** Short display name for the project index, e.g. `Fatoorah`. */
  name: string;
  /** Discipline line under the name in the index, e.g. `Embedded systems / telemetry`. */
  discipline: string;
  /** One-line summary for cards and listings. */
  summary: string;
  sectors: SectorId[];
  role: ProjectRole;
  period?: string;
  /** Short context line, e.g. `CU Boulder engineering capstone`. */
  context?: string;
  featured?: boolean;

  /** Plain-language explanation for nontechnical readers. */
  recruiter: {
    overview: string;
    contribution: string;
    whyItMatters?: string;
  };

  /** Engineering detail. Every field is optional so sparse projects render cleanly. */
  engineering: {
    problem?: string;
    architecture?: string;
    pipeline?: PipelineStep[];
    decisions?: Decision[];
    challenges?: string[];
  };

  stack: string[];
  /** Only verified outcomes belong here. */
  results?: Result[];
  links?: ExternalLink[];
  /** Attribution or scope notes, e.g. upstream authorship. */
  notes?: string[];
}

export interface SkillGroup {
  id: string;
  label: string;
  skills: string[];
}

export type LogKind = "education" | "training" | "certification" | "project" | "employment";

export interface LogEntry {
  id: string;
  kind: LogKind;
  title: string;
  organization: string;
  period: string;
  location?: string;
  description: string;
  /** Related project slug, if any. */
  project?: string;
}

export interface Education {
  id: string;
  institution: string;
  credential: string;
  detail?: string;
  period: string;
  location?: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  status: "earned" | "in-progress";
  /** Public verification URL (e.g. Credly), when available. */
  verifyUrl?: string;
}
