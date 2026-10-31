import type { Article } from "@/types/portfolio";

/**
 * Writing: articles and notes, newest first. Each entry links to a page on this site
 * (`/case-study/`) or to a full URL for anything published elsewhere.
 */
export const writing: Article[] = [
  {
    title: "Strong vs weak prompts",
    description:
      "Two portfolio sites built with Claude by the same person: one from short prompts, one from detailed briefs. The real prompts side by side, with what each led to.",
    href: "/case-study/",
    date: "26 Oct 2026",
    topic: "AI-assisted development",
  },
  {
    title: "Same person, two prompts: the designs side by side",
    description:
      "The two homepages cut in half, with the scattered prompts behind one and the single detailed brief behind the other.",
    href: "/compare/",
    date: "26 Oct 2026",
    topic: "Design",
  },
];
