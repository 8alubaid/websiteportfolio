import type { MetadataRoute } from "next";
import { projects, site } from "@/data";

// Generated once at build time for the static export.
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${site.url}/`, changeFrequency: "monthly", priority: 1 },
    { url: `${site.url}/terminal/`, changeFrequency: "monthly", priority: 0.7 },
    ...projects.map((p) => ({ url: `${site.url}/projects/${p.slug}/`, changeFrequency: "monthly" as const, priority: 0.8 })),
  ];
}
