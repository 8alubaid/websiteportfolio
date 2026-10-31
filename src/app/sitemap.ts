import type { MetadataRoute } from "next";
import { navigation, projects, site } from "@/data";

// Generated once at build time for the static export.
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...navigation.map((item) => ({ url: `${site.url}${item.href}`, changeFrequency: "monthly" as const, priority: item.href === "/" ? 1 : 0.8 })),
    { url: `${site.url}/terminal/`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${site.url}/case-study/`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${site.url}/compare/`, changeFrequency: "monthly", priority: 0.7 },
    ...projects.map((p) => ({ url: `${site.url}/projects/${p.slug}/`, changeFrequency: "monthly" as const, priority: 0.8 })),
  ];
}
