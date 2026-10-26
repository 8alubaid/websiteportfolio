import { profile } from "./profile";

/** Site-level configuration used for metadata, sitemap, and social previews. */
export const site = {
  name: profile.name,
  shortName: profile.name,
  description: `${profile.name}, ${profile.headline}. Cloud, AI, software, and embedded systems projects, explorable visually or through an interactive terminal.`,
  // Set by the GitHub Pages workflow (full URL, including any repository sub-path).
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, ""),
  hostname: "portfolio",
};

/**
 * Social preview image (public/og.png). Declared explicitly rather than via the
 * opengraph-image file convention: on GitHub Pages that convention's URL gets the
 * base path twice, and its generated file has no extension (served without an image type).
 */
export const ogImage = { url: "/og.png", width: 1200, height: 630, alt: `${profile.name}, ${profile.headline}` };

export const sections = [
  { id: "about", label: "About" },
  { id: "projects", label: "Projects" },
  { id: "experience", label: "Experience" },
  { id: "skills", label: "Skills" },
  { id: "certifications", label: "Education & Certifications" },
  { id: "contact", label: "Contact" },
] as const;

export type SectionId = (typeof sections)[number]["id"];
