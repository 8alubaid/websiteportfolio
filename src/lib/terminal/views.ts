/**
 * Terminal views: turn shared portfolio data into terminal output blocks.
 * Portfolio mode renders the same data with React components.
 */
import {
  certifications,
  education,
  logKindLabel,
  timeline,
  profile,
  resumeUrl,
  projectNumber,
  projects,
  sectorById,
  sectors,
  skillGroups,
} from "@/data";
import { caveats, criteria, pairs, sites, stats, takeaways } from "@/data/case-study";
import type { Project, SectorId } from "@/types/portfolio";
import type { Action, Block, Span } from "./types";

const text = (t: string): Block => ({ type: "paragraph", text: t });
const kv = (key: string, value: Span[] | string) => ({
  key: [{ text: key, tone: "muted" as const }],
  value: typeof value === "string" ? [value] : value,
});

export function whoamiView(): Block[] {
  return [
    { type: "line", spans: [{ text: profile.name, tone: "strong", bold: true }] },
    { type: "line", spans: [profile.headline, { text: " · ", tone: "muted" }, "CU Boulder · Minor in Engineering Management"] },
    {
      type: "line",
      spans: [
        { text: "Focus: ", tone: "muted" },
        ...profile.focus.flatMap((id, i): Span[] => [
          ...(i ? [{ text: " / ", tone: "muted" as const }] : []),
          { text: sectorById[id].label, command: `projects ${id}`, tone: "strong" },
        ]),
      ],
    },
  ];
}

export function aboutView(): Block[] {
  return [
    { type: "heading", text: "ABOUT", meta: profile.headline },
    ...profile.about.map(text),
    { type: "blank" },
    { type: "rows", rows: [kv("location", profile.location ?? "-"), kv("open to", profile.availability)] },
  ];
}

export function projectListView(filter?: SectorId): Block[] {
  const list = filter ? projects.filter((p) => p.sectors.includes(filter)) : projects;
  const heading = filter ? `PROJECTS · ${sectorById[filter].label.toUpperCase()}` : "PROJECTS";

  return [
    { type: "heading", text: heading, meta: `${list.length} of ${projects.length} projects` },
    {
      type: "rows",
      rows: list.map((p) => ({
        key: [
          { text: `${projectNumber(p)} `, tone: "muted" },
          { text: p.slug, command: `projects ${p.slug}`, tone: "strong" },
        ],
        value: [p.summary, { text: `  [${p.sectors.map((s) => sectorById[s].label).join(", ")}]`, tone: "muted" }],
      })),
    },
    { type: "blank" },
    {
      type: "line",
      spans: [
        { text: "Filter: ", tone: "muted" },
        ...sectors.flatMap((s, i): Span[] => [
          ...(i ? [{ text: "  ", tone: "muted" as const }] : []),
          { text: `projects ${s.id}`, command: `projects ${s.id}`, tone: "strong" },
        ]),
      ],
    },
  ];
}

export type ProjectViewMode = "full" | "brief" | "deep";

export function projectView(p: Project, mode: ProjectViewMode = "full"): Block[] {
  const meta = [p.role, p.context, p.period].filter(Boolean).join(" · ");
  const blocks: Block[] = [
    { type: "heading", text: `${projectNumber(p)} · ${p.title.toUpperCase()}`, meta },
    {
      type: "line",
      spans: [
        { text: "sectors: ", tone: "muted" },
        ...p.sectors.flatMap((s, i): Span[] => [
          ...(i ? [{ text: ", ", tone: "muted" as const }] : []),
          { text: sectorById[s].label, command: `projects ${s}`, tone: "muted" },
        ]),
      ],
    },
    text(p.summary),
  ];

  if (mode !== "deep") {
    blocks.push(
      { type: "section", text: "Recruiter overview" },
      text(p.recruiter.overview),
      { type: "section", text: "My contribution" },
      text(p.recruiter.contribution),
    );
    if (p.recruiter.whyItMatters) blocks.push({ type: "section", text: "Why it matters" }, text(p.recruiter.whyItMatters));
  }

  if (mode !== "brief") {
    const e = p.engineering;
    const hasDeep = e.problem || e.architecture || e.pipeline || e.decisions || e.challenges;
    if (hasDeep) blocks.push({ type: "section", text: "Engineering deep dive" });
    if (e.problem) blocks.push({ type: "line", spans: [{ text: "problem  ", tone: "muted" }, e.problem] });
    if (e.architecture) blocks.push({ type: "line", spans: [{ text: "design   ", tone: "muted" }, e.architecture] });
    if (e.pipeline) blocks.push({ type: "pipeline", steps: e.pipeline });
    if (e.decisions?.length) {
      blocks.push({ type: "section", text: "Technical decisions" });
      blocks.push({
        type: "list",
        items: e.decisions.map((d) => [{ text: d.title, bold: true }, { text: ": ", tone: "muted" }, d.detail]),
      });
    }
    if (e.challenges?.length) {
      blocks.push({ type: "section", text: "Challenges" });
      blocks.push({ type: "list", items: e.challenges.map((c) => [c]) });
    }
  }

  blocks.push({ type: "section", text: "Stack" }, { type: "tags", tags: p.stack });

  if (p.results?.length) blocks.push({ type: "section", text: "Verified results" }, { type: "results", results: p.results });
  if (p.notes?.length) blocks.push({ type: "list", bullet: "note", items: p.notes.map((n) => [{ text: n, tone: "muted" }]) });

  const actions: Action[] = [{ label: "View in Portfolio", href: `/projects/${p.slug}` }];
  for (const link of p.links ?? []) actions.push({ label: link.label, href: link.href, external: true });
  if (mode !== "full") actions.push({ label: "Full brief", command: `projects ${p.slug}` });
  if (mode !== "deep") actions.push({ label: "Deep dive only", command: `projects ${p.slug} --deep` });
  actions.push({ label: "All projects", command: "projects" });
  blocks.push({ type: "actions", actions });

  return blocks;
}

export function skillsView(groupId?: string): Block[] {
  const groups = groupId ? skillGroups.filter((g) => g.id === groupId) : skillGroups;
  return [
    { type: "heading", text: "SKILLS", meta: "Every item is backed by a project or credential" },
    ...groups.flatMap((g): Block[] => [
      { type: "line", spans: [{ text: g.label, tone: "strong" }] },
      { type: "tags", tags: g.skills },
    ]),
  ];
}

export function experienceView(): Block[] {
  return [
    { type: "heading", text: "EXPERIENCE", meta: "Education, training, certifications & projects, newest first" },
    {
      type: "rows",
      rows: timeline.map((e) => ({
        key: [{ text: e.period, tone: "muted" }],
        value: [
          { text: `[${logKindLabel[e.kind]}] `, tone: "muted" },
          { text: e.title, bold: true },
          { text: ` · ${e.organization}`, tone: "muted" },
          ...(e.project ? [{ text: "  →", tone: "muted" as const }, { text: ` ${e.project}`, command: `projects ${e.project}`, tone: "strong" as const }] : []),
        ],
      })),
    },
  ];
}

export function educationView(): Block[] {
  return [
    { type: "heading", text: "EDUCATION" },
    ...education.flatMap((e): Block[] => [
      { type: "line", spans: [{ text: e.credential, tone: "strong", bold: true }] },
      {
        type: "line",
        spans: [e.institution, { text: ` · ${e.period}${e.location ? ` · ${e.location}` : ""}`, tone: "muted" }],
      },
      ...(e.detail ? [{ type: "line" as const, spans: [{ text: e.detail, tone: "muted" as const }] }] : []),
      { type: "blank" },
    ]),
  ];
}

export function certificationsView(): Block[] {
  return [
    { type: "heading", text: "CERTIFICATIONS" },
    {
      type: "rows",
      rows: certifications.map((c) => ({
        key: [{ text: c.status === "earned" ? "■ earned" : "□ in progress", tone: "strong" }],
        value: [
          { text: c.name, bold: true },
          { text: ` · ${c.issuer}`, tone: "muted" },
          ...(c.verifyUrl ? [{ text: "  ", tone: "muted" as const }, { text: "verify ↗", href: c.verifyUrl, external: true }] : []),
        ],
      })),
    },
  ];
}

export function contactView(): Block[] {
  const { email, github, linkedin } = profile.contact;
  const rows = [];
  if (email) rows.push(kv("email", [{ text: email, href: `mailto:${email}`, external: true }]));
  if (github) rows.push(kv("github", [{ text: github.replace(/^https?:\/\//, ""), href: github, external: true }]));
  if (linkedin) rows.push(kv("linkedin", [{ text: linkedin.replace(/^https?:\/\/(www\.)?/, ""), href: linkedin, external: true }]));
  if (resumeUrl) rows.push(kv("resume", [{ text: "download PDF", href: resumeUrl, external: true }]));

  return [
    { type: "heading", text: "CONTACT" },
    text(profile.availability),
    rows.length ? { type: "rows", rows } : { type: "paragraph", text: "Contact links are being updated.", tone: "muted" },
    { type: "actions", actions: [{ label: "Open in Portfolio", href: "/" }] },
  ];
}

export function resumeView(): Block[] {
  if (!resumeUrl) {
    return [
      { type: "paragraph", tone: "strong", text: "The résumé PDF hasn't been published here yet." },
      {
        type: "line",
        spans: [
          { text: "Everything on it is available now: ", tone: "muted" },
          { text: "experience", command: "experience", tone: "strong" },
          { text: ", ", tone: "muted" },
          { text: "education", command: "education", tone: "strong" },
          { text: ", ", tone: "muted" },
          { text: "skills", command: "skills", tone: "strong" },
          { text: ". To request a copy, run ", tone: "muted" },
          { text: "contact", command: "contact", tone: "strong" },
          { text: ".", tone: "muted" },
        ],
      },
    ];
  }
  return [
    { type: "line", spans: [{ text: "Résumé ready: ", tone: "strong" }, { text: "open PDF ↗", href: resumeUrl, external: true }] },
  ];
}

const mark = (on: boolean) => (on ? "■" : "□");

/** `case-study` with no argument: the numbers, the rounds, and the takeaways. With a round id: that round in full. */
export function caseStudyView(roundId?: string): Block[] | undefined {
  const [weak, strong] = sites;
  const footer: Block = {
    type: "actions",
    actions: [
      { label: "Read in Portfolio", href: "/case-study/" },
      { label: "Design comparison", href: "/compare/" },
      { label: weak.name, href: weak.url, external: true },
    ],
  };

  if (roundId) {
    const index = pairs.findIndex((p) => p.id === roundId.toLowerCase());
    if (index < 0) return undefined;
    const p = pairs[index];
    return [
      { type: "heading", text: `ROUND ${String(index + 1).padStart(2, "0")} · ${p.title.toUpperCase()}`, meta: p.task },
      { type: "section", text: `${weak.label} · ${p.weak.date}` },
      { type: "paragraph", text: p.weak.quote },
      { type: "line", spans: [{ text: "→ ", tone: "muted" }, { text: p.weak.outcome, tone: "muted" }] },
      { type: "section", text: `${strong.label} · ${p.strong.date} · excerpts` },
      { type: "list", bullet: ">", items: p.strong.excerpts.map((e) => [e]) },
      { type: "line", spans: [{ text: "→ ", tone: "muted" }, { text: p.strong.outcome, tone: "muted" }] },
      { type: "section", text: "Criteria (weaker / stronger)" },
      {
        type: "rows",
        rows: criteria.map((c) => ({
          key: [{ text: c.label, tone: "muted" }],
          value: [`${mark(p.scores[c.id][0])}  ${mark(p.scores[c.id][1])}`],
        })),
      },
      footer,
    ];
  }

  return [
    { type: "heading", text: "CASE STUDY · STRONG VS WEAK PROMPTS", meta: `${weak.name} (${weak.period}) vs this site (${strong.period})` },
    text("Two portfolio sites built with Claude by the same person: one from short, open-ended prompts, one from detailed briefs."),
    { type: "section", text: "The numbers (weaker / stronger)" },
    { type: "rows", rows: stats.map((s) => kv(s.label, [{ text: `${s.weak}  /  ${s.strong}`, tone: "strong" }])) },
    { type: "section", text: "Rounds" },
    {
      type: "rows",
      rows: pairs.map((p) => ({
        key: [{ text: p.id, command: `case-study ${p.id}`, tone: "strong" }],
        value: [p.title],
      })),
    },
    { type: "section", text: "Takeaways" },
    { type: "list", items: takeaways.map((t) => [{ text: t.title, bold: true }, { text: ": ", tone: "muted" }, t.body]) },
    { type: "paragraph", tone: "muted", text: caveats },
    footer,
  ];
}

