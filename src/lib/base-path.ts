/** Base path the site is served from (`""` locally, `/repo-name` on a GitHub Pages project site). */
export const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/**
 * Prefix a root-relative path for use in a plain `<a>` or `window.open`.
 * `next/link` and the router add the base path automatically; raw URLs don't.
 * External URLs and `mailto:` links pass through unchanged.
 */
export function withBasePath(path: string): string {
  return path.startsWith("/") && !path.startsWith("//") ? `${basePath}${path}` : path;
}
