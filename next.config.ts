import type { NextConfig } from "next";

/**
 * Static export for GitHub Pages. The deploy workflow sets PAGES_BASE_PATH to the
 * repository sub-path (e.g. `/portfolio`), or to an empty string for a
 * `<user>.github.io` repository. Locally it is empty, so `npm run dev` is unchanged.
 */
const basePath = process.env.PAGES_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  // Emit `projects/x/index.html` so every route works on any static host.
  trailingSlash: true,
  // Plain <a> tags (e.g. the résumé link) need the base path too; see src/lib/base-path.ts.
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
  // No Cache Components: a static export has no request-time rendering to cache,
  // and its route handlers (robots, sitemap, OG image) need `dynamic = "force-static"`.
  devIndicators: false,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
