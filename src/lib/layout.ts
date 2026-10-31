/** The centered page column: 980px of content (the reference's measure) inside side gutters. */
export const pageContainer = "mx-auto w-full max-w-[65.25rem] px-5 sm:px-8";

/** Path without a trailing slash (static export serves /projects/ and /projects alike). */
export function normalizePath(pathname: string): string {
  return pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
}
